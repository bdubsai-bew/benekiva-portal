"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  role: string;
  carrier: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  "admin@benekiva.com": { email: "admin@benekiva.com", name: "Sarah Mitchell", role: "Admin", carrier: "Midwest Life Insurance" },
  "adjuster@benekiva.com": { email: "adjuster@benekiva.com", name: "Tom Bradley", role: "Claims Adjuster", carrier: "Midwest Life Insurance" },
  "demo@benekiva.com": { email: "demo@benekiva.com", name: "Demo User", role: "Admin", carrier: "Midwest Life Insurance" },
};

const STORAGE_KEY = "benekiva_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const u = MOCK_USERS[email.toLowerCase()];
    let loggedIn: User | null = null;

    if (u && (password === "demo123" || password === "demo")) {
      loggedIn = u;
    } else if (password === "demo123" || password === "demo") {
      loggedIn = { email, name: email.split("@")[0], role: "Admin", carrier: "Midwest Life Insurance" };
    }

    if (loggedIn) {
      setUser(loggedIn);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn)); } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
