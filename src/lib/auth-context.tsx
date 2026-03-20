"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

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
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  "admin@benekiva.com": { email: "admin@benekiva.com", name: "Sarah Mitchell", role: "Admin", carrier: "Midwest Life Insurance" },
  "adjuster@benekiva.com": { email: "adjuster@benekiva.com", name: "Tom Bradley", role: "Claims Adjuster", carrier: "Midwest Life Insurance" },
  "demo@benekiva.com": { email: "demo@benekiva.com", name: "Demo User", role: "Admin", carrier: "Midwest Life Insurance" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string): boolean => {
    const u = MOCK_USERS[email.toLowerCase()];
    if (u) {
      setUser(u);
      return true;
    }
    // Accept any email with password "demo"
    if (_password === "demo") {
      setUser({ email, name: email.split("@")[0], role: "Admin", carrier: "Midwest Life Insurance" });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
