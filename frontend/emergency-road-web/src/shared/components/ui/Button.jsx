// src/shared/components/ui/Button.jsx
import { Icon } from "./Icon";

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
    primary: { background: "#2563EB", color: "#fff" },
    secondary: {
      background: "#FFFFFF",
      color: "#0F1422",
      borderColor: "#CDD3DD",
    },
    ghost: { background: "transparent", color: "#0F1422" },
    danger: { background: "#FFFFFF", color: "#DC2626", borderColor: "#FECACA" },
    kakao: { background: "#FEE500", color: "#181600" },
  };
  const dis = disabled
    ? {
        background: "#EEF1F6",
        color: "#7B8392",
        borderColor: "transparent",
      }
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
