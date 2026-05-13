import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { api, TOKEN_KEY } from "@/lib/api";

export type Role = "HR" | "Employee";

export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  role: Role;
}

interface JwtPayload {
  sub?: string;
  nameid?: string;
  email?: string;
  unique_name?: string;
  name?: string;
  given_name?: string;
  role?: string | string[];
  ["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?: string | string[];
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]?: string;
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]?: string;
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]?: string;
  exp?: number;
}

const ROLE_CLAIMS = [
  "role",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
];

function normalizeRole(raw: string | string[] | undefined): Role {
  if (!raw) return "Employee";
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.toLowerCase() === "hr" ? "HR" : "Employee";
}

function decodeUser(token: string): AuthUser | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    let role: string | string[] | undefined;
    for (const claim of ROLE_CLAIMS) {
      const v = (payload as Record<string, unknown>)[claim];
      if (v) {
        role = v as string | string[];
        break;
      }
    }

    return {
      id:
        payload.sub ??
        payload.nameid ??
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email:
        payload.email ??
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      name:
        payload.name ??
        payload.given_name ??
        payload.unique_name ??
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      role: normalizeRole(role),
    };
  } catch {
    return null;
  }
}

interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    return t ? decodeUser(t) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const u = decodeUser(token);
      if (!u) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } else {
        setUser(u);
      }
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/api/auth/login", { email, password });
      const newToken = data.token ?? data.accessToken ?? data.jwt;
      if (!newToken) throw new Error("No token returned from server");
      localStorage.setItem(TOKEN_KEY, newToken);
      const decoded = decodeUser(newToken);
      if (!decoded) throw new Error("Invalid token received");
      setToken(newToken);
      setUser(decoded);
      return decoded;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await api.post("/api/auth/register", { name, email, password });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
