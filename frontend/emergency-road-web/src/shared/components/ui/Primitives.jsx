// =============================================================================
// Primitives — 응급길 UI Kit
// 출처: Design System / ui_kits/community/Primitives.jsx
// 변경사항: window.xxx → named export, React.useState → useState (import)
// =============================================================================
import { useState, useRef } from "react";

export const ACCENT = "#2563EB";
export const ACCENT_HOVER = "#1E50C2";
export const ACCENT_SOFT = "#EFF6FF";
export const ACCENT_SOFT_2 = "#E8F1FE";
export const CANVAS = "#F7F9FC";
export const SURFACE = "#FFFFFF";
export const SURFACE_SUNK = "#EEF1F6";
export const BORDER1 = "#E2E6EE";
export const BORDER2 = "#CDD3DD";
export const INK1 = "#0F1422";
export const INK2 = "#404757";
export const INK3 = "#7B8392";
export const KAKAO = "#FEE500";
export const KAKAO_FG = "#181600";
export const SUCCESS = "#1F8A5B";
export const WARNING = "#D97706";
export const DANGER = "#DC2626";

// ── Icon ──────────────────────────────────────────────────────────────────────
const ICONS = {
  home: "M3 12 12 3l9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 3.13a4 4 0 0 1 0 7.75",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M13.73 21a2 2 0 0 1-3.46 0",
  heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z",
  message:
    "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeOff:
    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24M1 1l22 22",
  mapPin:
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  more: "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z",
  camera:
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  plus: "M12 5v14M5 12h14",
  check: "M20 6 9 17l-5-5",
  alert:
    "M12 9v4M12 17h0M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  chevronRight: "m9 18 6-6-6-6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  image:
    "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM21 15l-5-5L5 21",
  x: "M18 6 6 18M6 6l12 12",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1ZM4 22v-7",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z",
  trash:
    "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
};

export function Icon({ name, size = 20, color, strokeWidth = 1.5, style }) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {d
        .split("M")
        .filter(Boolean)
        .map((seg, i) => (
          <path key={i} d={"M" + seg} />
        ))}
    </svg>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({
  variant = "primary",
  size = "md",
  children,
  leftIcon,
  fullWidth,
  disabled,
  onClick,
  type,
  style,
}) {
  const base = {
    fontFamily: "inherit",
    fontWeight: 600,
    lineHeight: 1,
    border: "1px solid transparent",
    borderRadius: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 150ms cubic-bezier(0.16,1,0.3,1)",
    width: fullWidth ? "100%" : undefined,
    boxSizing: "border-box",
  };
  const sizes = {
    sm: { fontSize: 13, padding: "8px 14px", borderRadius: 8 },
    md: { fontSize: 15, padding: "12px 18px" },
    lg: { fontSize: 16, padding: "14px 22px" },
  };
  const variants = {
    primary: { background: ACCENT, color: "#fff" },
    secondary: { background: SURFACE, color: INK1, borderColor: BORDER2 },
    ghost: { background: "transparent", color: INK1 },
    danger: { background: SURFACE, color: DANGER, borderColor: "#FECACA" },
    kakao: { background: KAKAO, color: KAKAO_FG },
  };
  const dis = disabled
    ? { background: SURFACE_SUNK, color: INK3, borderColor: "transparent" }
    : null;
  return (
    <button
      type={type || "button"}
      onClick={disabled ? undefined : onClick}
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        ...dis,
        ...style,
      }}
    >
      {leftIcon && <Icon name={leftIcon} size={size === "sm" ? 14 : 18} />}
      {children}
    </button>
  );
}

// ── Input / Field ─────────────────────────────────────────────────────────────
export function Field({ label, hint, error, children, action }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            fontWeight: 500,
            color: INK2,
          }}
        >
          <span>{label}</span>
          {action}
        </span>
      )}
      {children}
      {(error || hint) && (
        <span
          style={{
            fontSize: 12,
            color: error ? ACCENT : INK3,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {error && <Icon name="alert" size={12} />}
          {error || hint}
        </span>
      )}
    </label>
  );
}

export function Input({
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error,
  rightSlot,
  autoComplete,
  maxLength,
  onKeyDown,
}) {
  const [focus, setFocus] = useState(false);
  const border = error ? ACCENT : focus ? ACCENT : BORDER1;
  return (
    <span style={{ position: "relative", display: "flex" }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
        style={{
          font: "400 15px/1.4 inherit",
          padding: "12px 14px",
          paddingRight: rightSlot ? 44 : 14,
          border: `1px solid ${border}`,
          borderRadius: 8,
          background: "#fff",
          color: INK1,
          width: "100%",
          boxSizing: "border-box",
          outline: "none",
          colorScheme: "light",
          boxShadow: focus ? "0 0 0 3px rgba(37,99,235,0.18)" : "none",
          transition: "all 150ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {rightSlot && (
        <span
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {rightSlot}
        </span>
      )}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ name = "", src, size = 32 }) {
  const palettes = [
    ["#93C5FD", "#2563EB"],
    ["#BFDBFE", "#1E50C2"],
    ["#A8D5FF", "#1E40AF"],
    ["#C9DBF7", "#2563EB"],
    ["#B0CAEC", "#1E40AF"],
    ["#7DA8F0", "#1E3A8A"],
  ];
  const idx =
    [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % palettes.length;
  const [c1, c2] = palettes[idx];
  const initial = (name || "?").slice(0, 1);
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        fontSize: size * 0.42,
        flexShrink: 0,
        background: src
          ? `center/cover url(${src})`
          : `linear-gradient(135deg, ${c1}, ${c2})`,
      }}
    >
      {!src && initial}
    </span>
  );
}

// ── Pill / Chip ───────────────────────────────────────────────────────────────
export function Pill({ children, tone = "neutral", icon }) {
  const tones = {
    emergency: { background: ACCENT, color: "#fff" },
    success: { background: "rgba(31,138,91,0.1)", color: SUCCESS },
    warning: { background: "rgba(217,119,6,0.1)", color: WARNING },
    neutral: { background: SURFACE_SUNK, color: INK2 },
    soft: { background: ACCENT_SOFT, color: ACCENT },
    danger: { background: "rgba(220,38,38,0.08)", color: DANGER },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1,
        ...tones[tone],
      }}
    >
      {icon}
      {children}
    </span>
  );
}

export function Chip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        font: "500 13px var(--font-sans, inherit)",
        padding: "7px 13px",
        borderRadius: 999,
        background: active ? ACCENT_SOFT : "#fff",
        border: `1px solid ${active ? "#93C5FD" : BORDER1}`,
        color: active ? ACCENT : INK1,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 150ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </button>
  );
}

// ── AppBar ────────────────────────────────────────────────────────────────────
export function AppBar({ title, leftAction, rightAction, transparent }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        background: transparent ? "rgba(255,255,255,0.72)" : SURFACE,
        backdropFilter: transparent ? "blur(12px)" : undefined,
        WebkitBackdropFilter: transparent ? "blur(12px)" : undefined,
        borderBottom: `1px solid ${transparent ? "transparent" : BORDER1}`,
      }}
    >
      <span
        style={{
          minWidth: 40,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {leftAction}
      </span>
      <h1
        style={{
          flex: 1,
          textAlign: "center",
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: INK1,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </h1>
      <span
        style={{
          minWidth: 40,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {rightAction}
      </span>
    </header>
  );
}

// ── Wordmark ──────────────────────────────────────────────────────────────────
import logoMark from "../../../assets/logo.png";

export function Wordmark({ size = 28, withText = true }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <img
        src={logoMark}
        alt=""
        style={{ height: size, width: "auto", display: "block" }}
      />
      {withText && (
        <span
          style={{
            fontWeight: 800,
            fontSize: size * 0.72,
            letterSpacing: "-0.025em",
            color: ACCENT,
          }}
        >
          응급길
        </span>
      )}
    </span>
  );
}
