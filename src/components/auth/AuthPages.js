import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar","Chandigarh","Delhi","Jammu & Kashmir","Ladakh","Puducherry"
];

const MAIN_CROPS = [
  "Rice (Paddy)","Wheat","Maize","Sugarcane","Cotton","Soybean","Groundnut",
  "Mustard / Rapeseed","Jowar (Sorghum)","Bajra (Pearl Millet)","Tur (Arhar)",
  "Chana (Chickpea)","Onion","Potato","Tomato","Banana","Mango","Turmeric",
  "Chilli","Ginger","Mixed Vegetables","Other"
];

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const palette = {
  leaf:     "#2e7d32",
  leafLight:"#43a047",
  leafDim:  "#c8e6c9",
  soil:     "#4e342e",
  fog:      "#f5f7f5",
  white:    "#ffffff",
  border:   "#d7e8d7",
  red:      "#c62828",
  muted:    "#7a8c79",
  gold:     "#f9a825",
};

const S = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #e0f2f1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Lato', 'Segoe UI', sans-serif",
  },
  card: {
    background: palette.white,
    borderRadius: 20,
    boxShadow: "0 8px 40px rgba(46,125,50,0.12), 0 2px 8px rgba(0,0,0,0.06)",
    padding: "40px 36px",
    width: "100%",
    maxWidth: 440,
  },
  logo: {
    textAlign: "center",
    marginBottom: 28,
  },
  logoIcon: {
    fontSize: 44,
    lineHeight: 1,
    marginBottom: 8,
  },
  appName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 26,
    fontWeight: 700,
    color: palette.leaf,
    letterSpacing: "-0.5px",
  },
  tagline: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    color: palette.soil,
    marginBottom: 4,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  subheading: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 24,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: palette.soil,
    marginBottom: 6,
  },
  inputWrap: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: `1.5px solid ${palette.border}`,
    borderRadius: 10,
    fontSize: 14,
    color: palette.soil,
    background: palette.fog,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputFocus: {
    borderColor: palette.leaf,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    color: palette.muted,
    padding: 0,
    lineHeight: 1,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: palette.soil,
    cursor: "pointer",
    userSelect: "none",
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: palette.leaf,
    cursor: "pointer",
  },
  forgotLink: {
    fontSize: 13,
    color: palette.leaf,
    textDecoration: "none",
    fontWeight: 600,
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: `linear-gradient(135deg, ${palette.leaf}, ${palette.leafLight})`,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.3px",
    boxShadow: "0 4px 14px rgba(46,125,50,0.3)",
    transition: "opacity 0.2s, transform 0.1s",
  },
  btnDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    transform: "none",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
    color: palette.muted,
    fontSize: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: palette.border,
  },
  switchText: {
    textAlign: "center",
    fontSize: 13,
    color: palette.muted,
  },
  switchLink: {
    color: palette.leaf,
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    marginLeft: 4,
  },
  error: {
    background: "#fce4ec",
    border: "1px solid #f48fb1",
    color: palette.red,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 16,
  },
  select: {
    width: "100%",
    padding: "11px 14px",
    border: `1.5px solid ${palette.border}`,
    borderRadius: 10,
    fontSize: 14,
    color: palette.soil,
    background: palette.fog,
    outline: "none",
    boxSizing: "border-box",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8c79' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    cursor: "pointer",
  },
};

// ── FIELD COMPONENT ────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ── PASSWORD INPUT ─────────────────────────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder = "Enter password", name = "password" }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div style={S.inputWrap}>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={name === "confirmPassword" ? "new-password" : name === "password" ? "current-password" : "new-password"}
        style={{ ...S.input, paddingRight: 40, ...(focused ? S.inputFocus : {}) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={S.eyeBtn}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(form);
      // AuthProvider state update will trigger re-render → app shows dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        {/* Logo */}
        <div style={S.logo}>
          <div style={S.logoIcon}>🌾</div>
          <div style={S.appName}>KisanSaathi</div>
          <div style={S.tagline}>Farmer Advisory Platform</div>
        </div>

        <div style={S.heading}>Welcome back</div>
        <div style={S.subheading}>Sign in to your farmer account</div>

        {error && <div style={S.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <Field label="Email Address">
            <div style={{ marginBottom: 16 }}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  ...S.input,
                  ...(focusedField === "email" ? S.inputFocus : {})
                }}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </Field>

          {/* Password */}
          <Field label="Password">
            <PasswordInput
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </Field>

          {/* Remember Me + Forgot */}
          <div style={S.row}>
            <label style={S.checkLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                style={S.checkbox}
              />
              Remember me for 30 days
            </label>
            <span style={S.forgotLink}>Forgot password?</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span>New to KisanSaathi?</span>
          <div style={S.dividerLine} />
        </div>

        <div style={S.switchText}>
          Don't have an account?
          <span style={S.switchLink} onClick={onSwitch}>Create account →</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER PAGE
// ══════════════════════════════════════════════════════════════════════════════
export function RegisterPage({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", state: "", mainCrop: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, state, mainCrop } = form;
    if (!fullName || !email || !password || !confirmPassword || !state || !mainCrop) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    ...S.input,
    ...(focusedField === field ? S.inputFocus : {})
  });

  // Password strength indicator
  const pwStrength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "#e53935", width: "20%" };
    if (p.length < 8) return { label: "Weak", color: "#fb8c00", width: "40%" };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: "Strong", color: "#2e7d32", width: "100%" };
    return { label: "Fair", color: "#f9a825", width: "70%" };
  })();

  return (
    <div style={S.wrap}>
      <div style={{ ...S.card, maxWidth: 480, padding: "36px 32px" }}>
        {/* Logo */}
        <div style={S.logo}>
          <div style={S.logoIcon}>🌾</div>
          <div style={S.appName}>KisanSaathi</div>
          <div style={S.tagline}>Farmer Advisory Platform</div>
        </div>

        <div style={S.heading}>Create your account</div>
        <div style={S.subheading}>Join thousands of farmers across India</div>

        {error && <div style={S.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <Field label="Full Name">
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar Patel"
                autoComplete="name"
                style={inputStyle("fullName")}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </Field>

          {/* Email */}
          <Field label="Email Address">
            <div style={{ marginBottom: 16 }}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle("email")}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </Field>

          {/* Password */}
          <Field label="Password">
            <PasswordInput
              name="newPassword"
              value={form.password}
              onChange={(e) => handleChange({ target: { name: "password", value: e.target.value } })}
              placeholder="At least 6 characters"
            />
          </Field>

          {/* Password Strength */}
          {pwStrength && (
            <div style={{ marginTop: -10, marginBottom: 14 }}>
              <div style={{ height: 4, background: "#e0e0e0", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pwStrength.width, background: pwStrength.color, borderRadius: 2, transition: "width 0.3s, background 0.3s" }} />
              </div>
              <div style={{ fontSize: 11, color: pwStrength.color, marginTop: 4, fontWeight: 600 }}>{pwStrength.label}</div>
            </div>
          )}

          {/* Confirm Password */}
          <Field label="Confirm Password">
            <PasswordInput
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) => handleChange({ target: { name: "confirmPassword", value: e.target.value } })}
              placeholder="Re-enter your password"
            />
          </Field>

          {/* State */}
          <Field label="Farmer State">
            <div style={{ marginBottom: 16 }}>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                style={S.select}
              >
                <option value="">Select your state / UT</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </Field>

          {/* Main Crop */}
          <Field label="Main Crop">
            <div style={{ marginBottom: 20 }}>
              <select
                name="mainCrop"
                value={form.mainCrop}
                onChange={handleChange}
                style={S.select}
              >
                <option value="">Select your primary crop</option>
                {MAIN_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </Field>

          <button
            type="submit"
            disabled={loading}
            style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div style={{ ...S.switchText, marginTop: 20 }}>
          Already have an account?
          <span style={S.switchLink} onClick={onSwitch}>Sign in →</span>
        </div>
      </div>
    </div>
  );
}

export { INDIAN_STATES, MAIN_CROPS };