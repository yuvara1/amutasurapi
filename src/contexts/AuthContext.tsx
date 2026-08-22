import React, { createContext, useContext, useEffect, useState } from "react";
import { api, isMock, setTokens, clearTokens, getToken } from "@/infrastructure/api/client";
import type { Role, AuthUser, RegisterPayload } from "@/types";

interface AuthContextValue {
  role: Role;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: Role) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

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

export type { Role, AuthUser, RegisterPayload };
