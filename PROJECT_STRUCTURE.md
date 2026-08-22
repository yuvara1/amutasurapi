# FoodBridge — Maintainable React Folder Structure

A **feature-first** structure. Code is grouped by domain (donor, ngo,
volunteer, admin) rather than by file type, so each role's screens, components,
hooks, and API calls live together and stay easy to find, test, and delete.

Shared, cross-role code lives under `src/shared` and `src/lib`. The API layer is
centralized so swapping the mock hooks for the real endpoints in
`API_DOCUMENTATION.md` touches one place per resource.

---

## 1. Top-level tree

```
src/
├── main.tsx                     # entrypoint — mounts <App/>, imports index.css
├── App.tsx                      # providers + router shell only
├── index.css                    # Tailwind import, fonts, CSS variables, .dark tokens
├── vite-env.d.ts
│
├── app/                         # app-wide wiring (no business logic)
│   ├── providers/
│   │   ├── AppProviders.tsx     # composes Query, Theme, Socket, Router
│   │   ├── ThemeProvider.tsx    # ← contexts/ThemeContext.tsx
│   │   └── QueryProvider.tsx    # ← lib/queryClient.ts wiring
│   ├── router/
│   │   ├── routes.tsx           # route table (role-guarded)
│   │   └── RequireRole.tsx      # role-based route guard
│   └── layout/
│       ├── AppShell.tsx         # sidebar + header + right panel frame
│       ├── Sidebar.tsx          # ← components/Sidebar.tsx
│       ├── Header.tsx           # ← components/Header.tsx
│       └── RightPanel.tsx       # ← components/RightPanel.tsx
│
├── features/                    # one folder per domain / role
│   ├── auth/
│   │   ├── pages/AuthPage.tsx           # ← pages/Auth.tsx
│   │   ├── api/authApi.ts               # login, register, refresh, me
│   │   ├── hooks/useAuth.ts
│   │   └── schemas/auth.schema.ts       # ← loginSchema
│   │
│   ├── donor/
│   │   ├── pages/
│   │   │   ├── DonorDashboard.tsx
│   │   │   ├── CreateDonation.tsx
│   │   │   ├── DonationDetails.tsx
│   │   │   └── DonorImpact.tsx
│   │   ├── components/                  # donor-only UI pieces
│   │   ├── api/donationsApi.ts          # ← usePublishDonation, useDonations
│   │   ├── hooks/
│   │   └── schemas/donation.schema.ts   # ← donationSchema
│   │
│   ├── ngo/
│   │   ├── pages/
│   │   │   ├── NGODashboard.tsx
│   │   │   └── NGORequirements.tsx
│   │   ├── components/
│   │   ├── api/requirementsApi.ts
│   │   └── hooks/
│   │
│   ├── volunteer/
│   │   ├── pages/
│   │   │   ├── VolunteerDashboard.tsx
│   │   │   ├── MyDeliveries.tsx
│   │   │   └── DeliveryTracking.tsx
│   │   ├── components/
│   │   ├── api/deliveriesApi.ts         # ← useDeliveryStats
│   │   └── hooks/useDeliverySocket.ts   # ← hooks/useSocket.ts
│   │
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminMonitoring.tsx
│   │   │   └── Analytics.tsx
│   │   ├── components/
│   │   └── api/adminApi.ts
│   │
│   ├── notifications/
│   │   ├── pages/Notifications.tsx
│   │   ├── components/
│   │   └── api/notificationsApi.ts      # ← useNotificationsQuery, useMarkNotificationRead
│   │
│   └── marketing/
│       ├── pages/Landing.tsx
│       └── pages/Contact.tsx
│
├── shared/                      # reusable across features
│   ├── ui/                      # design-system primitives ← components/ui/*
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx            # ← components/Modal.tsx
│   │   └── ...                  # input, select, table, badge, toast, etc.
│   ├── components/              # composed shared widgets
│   │   └── FoodDomeGallery.tsx
│   ├── hooks/
│   │   └── useIsMobile.ts       # ← hooks/useIsMobile.ts
│   └── types/
│       ├── models.ts            # User, Donation, Delivery, Notification...
│       └── enums.ts             # Role, DonationStatus, DeliveryStatus
│
├── lib/                         # framework-agnostic utilities & clients
│   ├── api/
│   │   ├── httpClient.ts        # fetch wrapper: base URL, auth header, errors
│   │   └── socketClient.ts      # real WS client (replaces MockSocket)
│   ├── queryClient.ts           # ← lib/queryClient.ts
│   └── utils.ts                 # ← lib/utils.ts (cn, formatters)
│
├── store/
│   └── appStore.ts              # ← store/appStore.ts (zustand: role, nav, ui)
│
└── imports/                     # Figma design imports — leave as-is
    └── pasted_text/
```

---

## 2. Layering rules

Dependencies point **downward** only. This keeps the graph acyclic and features
independent.

```
app  →  features  →  shared  →  lib
              ↘         ↘
               store  ←──┘   (store is leaf-level, imported anywhere)
```

- **`app/`** knows about features (to route them) but features never import `app`.
- **`features/*`** may import `shared`, `lib`, `store` — **never another feature**.
  Cross-feature needs get promoted to `shared`.
- **`shared/` & `lib/`** never import from `features` or `app`.
- **`shared/ui`** are pure presentational primitives — no data fetching, no store.

---

## 3. Inside a feature (convention)

Each feature is self-contained and predictable:

```
features/donor/
├── pages/          # route-level screens
├── components/     # feature-local composed UI
├── api/            # React Query hooks wrapping httpClient endpoints
├── hooks/          # feature-local logic hooks
├── schemas/        # zod validation for this feature's forms
└── index.ts        # public surface — re-export pages the router needs
```

**API layer pattern** — one file per resource, colocated with its feature.
This is where the mock hooks in `useApi.ts` get split and pointed at the real
endpoints from `API_DOCUMENTATION.md`:

```ts
// features/donor/api/donationsApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api/httpClient";
import type { Donation } from "@/shared/types/models";

export const donationKeys = {
  all: ["donations"] as const,
  list: (scope: string) => [...donationKeys.all, scope] as const,
};

export function useDonations(scope = "mine") {
  return useQuery({
    queryKey: donationKeys.list(scope),
    queryFn: () => http.get<Donation[]>(`/donations?scope=${scope}`),
  });
}

export function usePublishDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DonationFormData) => http.post<Donation>("/donations", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: donationKeys.all }),
  });
}
```

---

## 4. Path aliases

`vite.config.ts` already maps `@` → `src`. Import with the alias, not relative
`../../..` chains:

```ts
import { Button } from "@/shared/ui/button";
import { useDonations } from "@/features/donor/api/donationsApi";
import { useAppStore } from "@/store/appStore";
```

Optional finer aliases for readability:
```
@/app  @/features  @/shared  @/lib  @/store
```

---

## 5. Naming conventions

| Kind | Convention | Example |
|------|-----------|---------|
| Component / page files | `PascalCase.tsx` | `DonorDashboard.tsx` |
| Hooks | `useX.ts` | `useDeliverySocket.ts` |
| API modules | `xApi.ts` | `donationsApi.ts` |
| Schemas | `x.schema.ts` | `donation.schema.ts` |
| Types | `models.ts`, `enums.ts` | — |
| Utilities | `camelCase.ts` | `utils.ts` |
| Feature barrels | `index.ts` | re-export public pages |

---

## 6. Migration map (current → target)

| Current | Move to |
|---------|---------|
| `components/Sidebar.tsx`, `Header.tsx`, `RightPanel.tsx` | `app/layout/` |
| `components/Modal.tsx` | `shared/ui/modal.tsx` |
| `components/ui/*` | `shared/ui/*` |
| `components/FoodDomeGallery.tsx` | `shared/components/` |
| `contexts/ThemeContext.tsx` | `app/providers/ThemeProvider.tsx` |
| `hooks/useIsMobile.ts` | `shared/hooks/` |
| `hooks/useApi.ts` | split into each feature's `api/*Api.ts` |
| `hooks/useSocket.ts` | `features/volunteer/hooks/` + `lib/api/socketClient.ts` |
| `lib/schemas.ts` | split into each feature's `schemas/*.schema.ts` |
| `lib/utils.ts`, `queryClient.ts` | `lib/` (add `lib/api/httpClient.ts`) |
| `pages/*` | grouped under `features/<role>/pages/` |
| `store/appStore.ts` | `store/` (unchanged) |

> Suggested order: (1) add `@` sub-aliases, (2) move `components/ui` → `shared/ui`
> and fix imports, (3) create `lib/api/httpClient.ts`, (4) lift pages into
> features one role at a time, (5) split `useApi.ts` / `schemas.ts` last.
> Each step is independently shippable.
```

---

## 7. Why feature-first here

- **Role isolation** matches your product — donor, ngo, volunteer, and admin
  work is truly separate; a change to admin analytics never risks donor flows.
- **Deletability** — retiring a role = deleting one folder.
- **API centralization** — the mock→real swap from `API_DOCUMENTATION.md`
  happens in `features/*/api/*` behind stable hook names, so screens don't change.
- **Onboarding** — a new dev opens `features/volunteer/` and sees everything the
  volunteer role does in one place.
