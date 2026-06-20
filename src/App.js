import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RegisterPage } from "./components/auth/AuthPages";

// Your existing KisanSaathi dashboard — import it here.
// This keeps your entire existing app.js logic untouched.
import KisanSaathiDashboard from "./KisanSaathiDashboard";

export default function App() {
  const { isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // If showing register page explicitly
  if (showRegister && !isAuthenticated) {
    return <RegisterPage onSwitch={() => setShowRegister(false)} />;
  }

  return (
    <ProtectedRoute onShowRegister={() => setShowRegister(true)}>
      <KisanSaathiDashboard />
    </ProtectedRoute>
  );
}