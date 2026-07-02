import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_BASE = process.env.REACT_APP_API_URL;
console.log("=================================");
console.log("API_BASE:", API_BASE);
console.log("LOGIN URL:", `${API_BASE}/api/auth/login`);
console.log("=================================");

console.log("API_BASE =", API_BASE);
console.log("LOGIN URL =", `${API_BASE}/api/auth/login`);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true on initial load

  // On mount: restore session from localStorage
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

  // Persist token and user whenever they change
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

  // ── REGISTER ────────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    persistSession(data.token, data.user);
    return data;
  }, [persistSession]);

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password, rememberMe }) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    persistSession(data.token, data.user);
    return data;
  }, [persistSession]);

  // ── LOGOUT ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    persistSession(null, null);
  }, [persistSession]);

  // ── AUTHENTICATED FETCH HELPER ────────────────────────────────────────────────
  const authFetch = useCallback(async (url, options = {}) => {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    if (res.status === 401 || res.status === 403) {
      logout(); // token expired — force re-login
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