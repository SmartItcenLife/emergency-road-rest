import { Icon } from "./Icon";

export function Pill({ children, tone = "neutral", icon }) {
  const tones = {
    emergency: { background: "#2563EB", color: "#fff" },
    success: { background: "rgba(31,138,91,0.1)", color: "#1F8A5B" },
    warning: { background: "rgba(217,119,6,0.1)", color: "#D97706" },
    neutral: { background: "#EEF1F6", color: "#404757" },
    soft: { background: "#EFF6FF", color: "#2563EB" },
    danger: { background: "rgba(220,38,38,0.08)", color: "#DC2626" },
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
