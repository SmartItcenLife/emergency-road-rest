// src/shared/components/ui/Wordmark.jsx
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
            color: "#2563EB",
          }}
        >
          응급길
        </span>
      )}
    </span>
  );
}
