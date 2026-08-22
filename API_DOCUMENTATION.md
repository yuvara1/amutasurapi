# FoodBridge — API Documentation

Backend contract for the food-donation platform. Covers all four roles
(**donor**, **ngo**, **volunteer**, **admin**), the REST endpoints each role
consumes, the WebSocket real-time channel, shared data models, and auth.

This spec is derived from the existing frontend contracts in
`src/hooks/useApi.ts`, `src/hooks/useSocket.ts`, `src/lib/schemas.ts`, and
`src/store/appStore.ts`, so the real API can be dropped in behind the current
React Query hooks with minimal changes.

---

## 1. Conventions

| Item | Value |
|------|-------|
| Base URL | `https://api.foodbridge.org/v1` |
| Format | JSON (`Content-Type: application/json`) |
| Auth | `Authorization: Bearer <jwt>` on every non-public route |
| Dates | ISO 8601 UTC (`2026-08-21T17:30:00Z`) |
| IDs | Prefixed strings — `DON-2026-000125`, `DEL-2026-000088`, `USR-...`, `ORG-...` |
| Pagination | `?page=1&limit=20` → response wrapped in `{ data, meta }` |
| Errors | `{ "error": { "code": "string", "message": "string", "details"?: any } }` |

### Standard error codes
`UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`,
`CONFLICT`, `RATE_LIMITED`, `INTERNAL`.

### Paginated envelope
```json
{
  "data": [ /* items */ ],
  "meta": { "page": 1, "limit": 20, "total": 120, "totalPages": 6 }
}
```

---

## 2. Authentication & Authorization

JWT-based. The token payload carries `sub` (user id), `role`, and `orgId`.
Every role-scoped endpoint validates the role claim server-side — never trust
a role sent from the client.

### `POST /auth/register`
Public. Creates a user + organization.
```json
// request  (validated with the same rules as loginSchema/donationSchema)
{
  "name": "Sarah Chen",
  "email": "sarah@greenharvest.org",   // valid email
  "password": "••••••",                 // min 6 chars
  "role": "donor",                      // donor | ngo | volunteer | admin
  "orgName": "Green Harvest Co."
}
// 201
{ "user": { /* User */ }, "token": "jwt...", "refreshToken": "jwt..." }
```

### `POST /auth/login`
Public.
```json
// request  → matches loginSchema
{ "email": "sarah@greenharvest.org", "password": "••••••" }
// 200
{ "user": { /* User */ }, "token": "jwt...", "refreshToken": "jwt..." }
```

### `POST /auth/refresh`
`{ "refreshToken": "jwt..." }` → `{ "token": "jwt...", "refreshToken": "jwt..." }`

### `POST /auth/logout`
Invalidates the refresh token. `204`.

### `GET /auth/me`
Returns the authenticated `User` + `Organization`.

---

## 3. Shared Data Models

These mirror the TypeScript interfaces already used by the frontend.

### User
```ts
{
  id: string;              // USR-...
  name: string;
  email: string;
  initials: string;        // "SC"
  role: "donor" | "ngo" | "volunteer" | "admin";
  orgId: string;
  orgName: string;
  avatarUrl?: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
}
```

### Organization
```ts
{
  id: string;              // ORG-...
  name: string;
  type: "donor" | "ngo";
  verified: boolean;
  address: string;
  lat: number; lng: number;
  contactPerson: string;
  contactPhone: string;
}
```

### Donation  (`useApi.ts` → `Donation`)
```ts
{
  id: string;              // DON-2026-000125
  title: string;           // "Assorted Produce Mix"
  category: string;        // Produce | Bakery | Dairy | Prepared Meals | ...
  quantity: string;        // "48 kg"  |  "30 portions"
  status: "pending" | "matched" | "in_transit" | "completed" | "expired";
  ngo?: string;            // matched NGO name
  date: string;            // human relative or ISO
  expiry: string;          // "Tomorrow 10 AM" | ISO
  impact?: string;         // "96 meals" (set on completion)

  // extended fields for the real API (write side, from donationSchema):
  foodName: string;
  unit: string;            // kg | portions | boxes | trays
  description?: string;
  dietaryTags?: string[];  // vegetarian | vegan | halal | gluten-free ...
  preparedAt?: string;
  expiresAt: string;
  storage: string;         // ambient | refrigerated | frozen
  safetyNotes?: string;
  address: string;
  pickupStart: string;
  pickupEnd: string;
  contactPerson: string;
  pickupInstructions?: string;
  donorId: string;
  ngoId?: string;
  deliveryId?: string;
}
```

### Delivery
```ts
{
  id: string;              // DEL-2026-000088
  donationId: string;
  ngoId: string;
  volunteerId?: string;
  status: "unassigned" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  pickup:  { address: string; lat: number; lng: number; window: [string, string] };
  dropoff: { address: string; lat: number; lng: number };
  etaMinutes?: number;
  proofPhotoUrl?: string;  // pickup / delivery confirmation
  assignedAt?: string;
  completedAt?: string;
}
```

### NotificationItem  (`useApi.ts` → `NotificationItem`)
```ts
{
  id: number;
  cat: "matches" | "deliveries" | "donations" | "system";
  icon: string;            // lucide name: zap | truck | check | party | clock | shield | x | camera
  title: string;
  body: string;
  time: string;            // relative or ISO
  read: boolean;
}
```

### Requirement (NGO need)
```ts
{
  id: string;              // REQ-...
  ngoId: string;
  category: string;
  quantityNeeded: string;
  neededBy: string;
  notes?: string;
  status: "open" | "partially_met" | "fulfilled";
}
```

---

## 4. Donor APIs

The donor creates donations, tracks matches/deliveries, and views impact.
Screens: `DonorDashboard`, `CreateDonation`, `DonorImpact`, `DonationDetails`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/donations?scope=mine&status=&page=` | List donor's donations (feeds `useDonations`) |
| `POST` | `/donations` | Publish a donation (feeds `usePublishDonation`) |
| `GET`  | `/donations/:id` | Full donation detail (`DonationDetails` modal) |
| `PATCH`| `/donations/:id` | Edit while `pending` |
| `POST` | `/donations/:id/cancel` | Cancel a pending/matched donation |
| `GET`  | `/donors/me/impact` | Impact stats for `DonorImpact` |

### `POST /donations`
Body validated by `donationSchema`. Returns the created `Donation` with
server `id` and `status: "pending"`. Triggers matching (§8) and emits
`notification:new` to matched NGOs.

### `GET /donors/me/impact`
```json
{
  "totalKgRescued": 8640,
  "mealsServed": 17280,
  "donationsCompleted": 247,
  "co2AvoidedKg": 21600,
  "ngosServed": 18,
  "monthly": [ { "month": "2026-08", "kg": 284, "meals": 96 } ]
}
```

---

## 5. NGO APIs

The NGO browses/accepts available donations and posts requirements.
Screens: `NGODashboard`, `NGORequirements`, `DonationDetails`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/donations?scope=available&category=&maxDistanceKm=&page=` | Browse matchable donations |
| `GET`  | `/donations?scope=claimed&status=` | Donations this NGO accepted |
| `POST` | `/donations/:id/accept` | Accept a match → status `matched`, creates a `Delivery` |
| `POST` | `/donations/:id/decline` | Decline a suggested match |
| `POST` | `/donations/:id/confirm-receipt` | Mark received → status `completed` |
| `GET`  | `/requirements?scope=mine` | List NGO requirements |
| `POST` | `/requirements` | Create a requirement |
| `PATCH`| `/requirements/:id` | Update/close a requirement |
| `GET`  | `/ngos/me/stats` | Dashboard KPIs |

### `POST /donations/:id/accept`
Transitions donation `pending|matched → matched`, creates a `Delivery`
(`status: "unassigned"`), and notifies the donor + available volunteers.
```json
// 200
{ "donation": { /* Donation */ }, "delivery": { /* Delivery */ } }
```

---

## 6. Volunteer APIs

The volunteer picks up assignments and moves them to completion.
Screens: `VolunteerDashboard`, `MyDeliveries`, `DeliveryTracking`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/deliveries?scope=available&maxDistanceKm=` | Open, unassigned deliveries |
| `GET`  | `/deliveries?scope=mine&status=` | Volunteer's deliveries (feeds `MyDeliveries`) |
| `POST` | `/deliveries/:id/accept` | Claim an assignment → `assigned` |
| `POST` | `/deliveries/:id/pickup` | Confirm pickup (+ `proofPhoto`) → `picked_up` / `in_transit` |
| `POST` | `/deliveries/:id/location` | Push live GPS (emits `delivery:position`) |
| `POST` | `/deliveries/:id/complete` | Confirm dropoff (+ `proofPhoto`) → `delivered` |
| `POST` | `/deliveries/:id/cancel` | Release the assignment |
| `GET`  | `/volunteers/me/stats` | KPIs (feeds `useDeliveryStats`) |

### `GET /volunteers/me/stats`  (→ `DeliveryStats`)
```json
{ "completed": 247, "inProgress": 3, "totalKg": 8640, "rating": 4.9 }
```

### `POST /deliveries/:id/location`
```json
// request (throttle ~1/3s client-side; mirrors the mock simulation)
{ "lat": 37.7935, "lng": -122.3965 }
// 202  → broadcasts delivery:position + recomputed delivery:eta
```

### `POST /deliveries/:id/pickup` and `/complete`
`multipart/form-data` with a `proofPhoto` file, or `{ "proofPhotoUrl": "..." }`
if uploaded separately via §9. Emits `delivery:status`.

---

## 7. Admin APIs

Platform oversight, verification, and analytics.
Screens: `AdminDashboard`, `AdminMonitoring`, `Analytics`.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/admin/overview` | Top-line platform KPIs |
| `GET`  | `/admin/organizations?verified=&type=&page=` | All orgs |
| `POST` | `/admin/organizations/:id/verify` | Verify an org (emits `system` notification) |
| `POST` | `/admin/organizations/:id/suspend` | Suspend an org |
| `GET`  | `/admin/donations?status=&page=` | All donations (monitoring) |
| `GET`  | `/admin/deliveries?status=&page=` | Live delivery board (`AdminMonitoring`) |
| `GET`  | `/admin/users?role=&page=` | Manage users |
| `GET`  | `/admin/analytics?range=30d&groupBy=day` | Time-series for `Analytics` |
| `GET`  | `/admin/system/health` | Service health for the monitoring page |

### `GET /admin/overview`
```json
{
  "totalDonations": 4820, "activeDonations": 63,
  "totalKgRescued": 184320, "mealsServed": 368640,
  "orgs": { "donors": 142, "ngos": 88, "pendingVerification": 7 },
  "volunteers": { "active": 210, "onDelivery": 14 },
  "matchRate": 0.91, "avgDeliveryMinutes": 34
}
```

### `GET /admin/analytics`
```json
{
  "range": "30d",
  "series": {
    "kgRescued":  [ { "t": "2026-07-23", "v": 512 }, ... ],
    "donations":  [ { "t": "2026-07-23", "v": 61 }, ... ],
    "matchRate":  [ { "t": "2026-07-23", "v": 0.88 }, ... ]
  },
  "byCategory": [ { "category": "Produce", "kg": 42000 }, ... ]
}
```

---

## 8. Matching Engine

When a donation is published, the server scores candidate NGOs and produces
match suggestions (the "94% score" seen in notifications).

- **Inputs:** category ↔ open `Requirement`, geo distance, expiry window vs.
  NGO availability, historical acceptance.
- **Output:** ranked matches; the top match (or all above a threshold) receive
  a `notification:new` and the donation surfaces in their
  `scope=available` feed.
- On `accept`, remaining suggestions are invalidated.

`GET /donations/:id/matches` (donor/admin) returns the ranked candidates:
```json
{ "matches": [ { "ngoId": "ORG-...", "ngoName": "Community Kitchen", "score": 0.94, "distanceKm": 3.2 } ] }
```

---

## 9. File Uploads

Proof photos, org logos.

### `POST /uploads`
`multipart/form-data`, field `file`. Returns `{ "url": "https://...", "id": "..." }`.
Reference the returned `url`/`id` in delivery pickup/complete and profile calls.

---

## 10. Notifications

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/notifications?cat=&page=` | List (feeds `useNotificationsQuery`, poll 30s or use WS) |
| `POST` | `/notifications/:id/read` | Mark one read (feeds `useMarkNotificationRead`) |
| `POST` | `/notifications/read-all` | Mark all read |
| `GET`  | `/notifications/unread-count` | Per-role badge counts (`notifCounts`) |

`GET /notifications/unread-count` → `{ "matches": 1, "deliveries": 1, "donations": 1, "system": 0, "total": 3 }`

---

## 11. Real-time (WebSocket)

Replaces the `MockSocket` in `src/hooks/useSocket.ts`.

| Item | Value |
|------|-------|
| URL | `wss://api.foodbridge.org/v1/realtime?token=<jwt>` |
| Transport | Socket.IO or raw WS; JSON frames `{ "event": string, "data": object }` |
| Rooms | Auto-joined on connect: `user:<id>`, `org:<orgId>`, `role:<role>`, plus `delivery:<id>` when tracking |

### Server → client events
| Event | Payload | Emitted when |
|-------|---------|--------------|
| `delivery:position` | `{ lat: number, lng: number }` | Volunteer pushes GPS (§6) |
| `delivery:eta`      | `{ minutes: number }` | ETA recomputed |
| `delivery:status`   | `{ phase: "assigned" \| "picked_up" \| "in_transit" \| "delivered" }` | Status transitions |
| `notification:new`  | `{ id: number, title: string, cat: string, body: string }` | Any notify trigger |

### Client → server events
| Event | Payload | Purpose |
|-------|---------|---------|
| `delivery:subscribe`   | `{ deliveryId: string }` | Join `delivery:<id>` room (tracking screen) |
| `delivery:unsubscribe` | `{ deliveryId: string }` | Leave on unmount |
| `location:push`        | `{ deliveryId, lat, lng }` | Volunteer app streaming GPS |

> The current hook subscribes to `delivery:position`, `delivery:eta`, and
> `delivery:status` and runs a 20-step simulated route. Point `getSocket()` at a
> real Socket.IO client keeping the same event names and the tracking UI works
> unchanged.

---

## 12. Endpoint → Frontend map

| Frontend hook / screen | Endpoint(s) |
|------------------------|-------------|
| `useDonations()` | `GET /donations?scope=...` |
| `usePublishDonation()` | `POST /donations` |
| `useNotificationsQuery()` | `GET /notifications` |
| `useMarkNotificationRead()` | `POST /notifications/:id/read` |
| `useDeliveryStats()` | `GET /volunteers/me/stats` |
| `useDeliverySocket()` | WS `delivery:position` / `:eta` / `:status` |
| `Auth` | `POST /auth/login`, `POST /auth/register` |
| `DonorImpact` | `GET /donors/me/impact` |
| `NGORequirements` | `/requirements*` |
| `MyDeliveries` / `DeliveryTracking` | `/deliveries*` + WS |
| `AdminDashboard` / `AdminMonitoring` / `Analytics` | `/admin/*` |

---

## 13. Role → permission matrix

| Resource | donor | ngo | volunteer | admin |
|----------|:-----:|:---:|:---------:|:-----:|
| Create donation | ✅ | — | — | — |
| Accept donation / confirm receipt | — | ✅ | — | — |
| Accept & complete delivery | — | — | ✅ | — |
| Post requirements | — | ✅ | — | — |
| Verify / suspend orgs | — | — | — | ✅ |
| Platform analytics | own | own | own | ✅ all |
| Notifications (own) | ✅ | ✅ | ✅ | ✅ |

Enforce with a role-claim middleware; scope every list query to the caller's
`orgId`/`sub` unless the caller is `admin`.
