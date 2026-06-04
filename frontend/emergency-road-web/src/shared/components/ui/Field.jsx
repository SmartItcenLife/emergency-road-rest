// src/shared/components/ui/Field.jsx
import { Icon } from "./Icon";

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
            color: "#404757", // ← 수정
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
            color: error ? "#2563EB" : "#7B8392", // ← 수정
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
