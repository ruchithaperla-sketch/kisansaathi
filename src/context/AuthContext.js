import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("ks_token");
    const savedUser = localStorage.getItem("ks_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("ks_token");
        localStorage.removeItem("ks_user");
      }
    }
    setLoading(false);
  }, []);

  const persistSession = useCallback((tok, usr) => {
    setToken(tok);
    setUser(usr);
    if (tok) {
      localStorage.setItem("ks_token", tok);
      localStorage.setItem("ks_user", JSON.stringify(usr));
    } else {
      localStorage.removeItem("ks_token");
      localStorage.removeItem("ks_user");
    }
  }, []);

  const register = useCallback(async (formData) => {
    const res = await fetch(`${process.env.react_app_api_url || "http://localhost:3001"}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    persistSession(data.token, data.user);
    return data;
  }, [persistSession]);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const res = await fetch(`${process.env.react_app_api_url || "http://localhost:3001"}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    persistSession(data.token, data.user);
    return data;
  }, [persistSession]);

  const logout = useCallback(() => {
    persistSession(null, null);
  }, [persistSession]);

  const authFetch = useCallback(async (url, options = {}) => {
    const res = await fetch(`${process.env.react_app_api_url || "http://localhost:3001"}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    if (res.status === 401 || res.status === 403) {
      logout();
      throw new Error("Session expired. Please log in again.");
    }
    return res;
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}