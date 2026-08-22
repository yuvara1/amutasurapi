import React, { createContext, useContext, useEffect, useState } from "react";
<<<<<<< HEAD
import { api, isMock, setTokens, clearTokens, getToken } from "@/lib/api";

export type Role = "donor" | "ngo" | "volunteer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  /** Only NGOs belong to an organization. Donors and volunteers register as individuals. */
  orgId?: string;
  orgName?: string;
  avatarUrl?: string;
  verified: boolean;
}
=======
import { api, isMock, setTokens, clearTokens, getToken } from "@/infrastructure/api/client";
import type { Role, AuthUser, RegisterPayload } from "@/types";
>>>>>>> origin/bw-redesign-clean

interface AuthContextValue {
  role: Role;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
<<<<<<< HEAD
  /** Mock-only: set role without hitting the server (used by Auth page in mock mode). */
  login: (role: Role) => void;
  /** Real API: POST /auth/login → returns token, sets auth state. */
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  /** Real API: POST /auth/register → returns token, sets auth state. */
=======
  login: (role: Role) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
>>>>>>> origin/bw-redesign-clean
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

<<<<<<< HEAD
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  /** Required for NGOs only. Donors and volunteers register as individuals. */
  orgName?: string;
}

=======
>>>>>>> origin/bw-redesign-clean
interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("donor");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(!isMock);

<<<<<<< HEAD
  /* Re-hydrate from stored token on mount (real API only). */
=======
>>>>>>> origin/bw-redesign-clean
  useEffect(() => {
    if (isMock) return;
    const token = getToken();
    if (!token) { setIsLoading(false); return; }

    api.get<AuthUser>("/auth/me")
      .then((me) => {
        setUser(me);
        setRole(me.role);
        setIsAuthenticated(true);
      })
      .catch(() => clearTokens())
      .finally(() => setIsLoading(false));
  }, []);

<<<<<<< HEAD
  /* Mock-mode fast-login (no network call). */
=======
>>>>>>> origin/bw-redesign-clean
  const login = (r: Role) => {
    setRole(r);
    setIsAuthenticated(true);
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password }, { public: true });
    setTokens(res.token, res.refreshToken);
    setUser(res.user);
    setRole(res.user.role);
    setIsAuthenticated(true);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await api.post<AuthResponse>("/auth/register", payload, { public: true });
    setTokens(res.token, res.refreshToken);
    setUser(res.user);
    setRole(res.user.role);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (!isMock) {
      try { await api.post("/auth/logout"); } catch { /* best-effort */ }
    }
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ role, user, isAuthenticated, isLoading, login, loginWithCredentials, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
<<<<<<< HEAD
=======

export type { Role, AuthUser, RegisterPayload };
>>>>>>> origin/bw-redesign-clean
