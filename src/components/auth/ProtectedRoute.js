import { useAuth } from "../../context/AuthContext";
import { LoginPage } from "../auth/AuthPages";

/**
 * Wraps any component that requires authentication.
 * Shows a spinner while the token is being restored from localStorage,
 * then renders the login screen if the user is not authenticated.
 */
export function ProtectedRoute({ children, onShowRegister }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>🌾</div>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 22,
          color: "#2e7d32",
          fontWeight: 700,
        }}>
          KisanSaathi
        </div>
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid #c8e6c9",
          borderTop: "3px solid #2e7d32",
          borderRadius: "50%",
          animation: "ks-spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes ks-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onSwitch={onShowRegister} />;
  }

  return children;
}