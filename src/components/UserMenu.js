import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * Compact user menu for the top navigation bar.
 * Shows avatar initials, user name, and a dropdown with logout.
 */
export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(o => !o)}
        title={user.fullName}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "1.5px solid #c8e6c9",
          borderRadius: 20,
          padding: "5px 10px 5px 5px",
          cursor: "pointer",
        }}
      >
        <div style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2e7d32, #43a047)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <span style={{ fontSize: 13, color: "#2e7d32", fontWeight: 600, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.fullName.split(" ")[0]}
        </span>
        <span style={{ fontSize: 10, color: "#7a8c79" }}>{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "calc(100% + 8px)",
          background: "#fff",
          border: "1.5px solid #d7e8d7",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(46,125,50,0.12)",
          minWidth: 200,
          zIndex: 1000,
          overflow: "hidden",
        }}>
          {/* User info */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #e8f5e9" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#4e342e" }}>{user.fullName}</div>
            <div style={{ fontSize: 12, color: "#7a8c79", marginTop: 2 }}>{user.email}</div>
            {user.state && (
              <div style={{ fontSize: 11, color: "#2e7d32", marginTop: 6, background: "#e8f5e9", borderRadius: 6, padding: "2px 8px", display: "inline-block", fontWeight: 600 }}>
                📍 {user.state} · {user.mainCrop}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={() => { logout(); setOpen(false); }}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "none",
              border: "none",
              textAlign: "left",
              fontSize: 13,
              color: "#c62828",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  );
}