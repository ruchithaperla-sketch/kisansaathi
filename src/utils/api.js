/**
 * api.js — Authenticated API helpers for KisanSaathi
 *
 * Usage:
 *   const { authFetch } = useAuth();
 *   const res = await apiChat(authFetch, prompt);
 */

const BASE = process.env.REACT_APP_API_URL ;

export async function apiChat(authFetch, prompt) {
  const res = await authFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Chat failed");
  return data.text;
}

export async function apiAnalyzeImage(authFetch, image, query = "") {
  const res = await authFetch("/api/analyze-image", {
    method: "POST",
    body: JSON.stringify({ image, query }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Image analysis failed");
  return data.text;
}

export async function apiGetMe(token) {
  const res = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Session check failed");
  return data.user;
}