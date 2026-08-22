const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
const WS_BASE = (import.meta.env.VITE_WS_URL as string | undefined) ?? "";

export const isMock = !BASE;
export const wsUrl = WS_BASE;

/* ── Token storage ───────────────────────────────────────────── */

const TOKEN_KEY = "fb_token";
const REFRESH_KEY = "fb_refresh";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

/* ── Error type ──────────────────────────────────────────────── */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ── Fetch wrapper ───────────────────────────────────────────── */

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  public?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, public: isPublic, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (!isPublic) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = (json as { error?: { code?: string; message?: string; details?: unknown } }).error;
    throw new ApiError(
      res.status,
      err?.code ?? "UNKNOWN",
      err?.message ?? `HTTP ${res.status}`,
      err?.details,
    );
  }

  return json as T;
}

/* ── Paginated envelope ──────────────────────────────────────── */

export interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

/* ── Convenience shorthands ──────────────────────────────────── */

export const api = {
  get: <T>(path: string, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "GET", ...opts }),

  post: <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "POST", body, ...opts }),

  patch: <T>(path: string, body?: unknown, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "PATCH", body, ...opts }),

  delete: <T>(path: string, opts?: FetchOptions) =>
    apiFetch<T>(path, { method: "DELETE", ...opts }),
};
