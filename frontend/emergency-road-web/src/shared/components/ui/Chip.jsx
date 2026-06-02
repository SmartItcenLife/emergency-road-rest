// src/shared/components/ui/Chip.jsx
export function Chip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        font: "500 13px inherit",
        padding: "7px 13px",
        borderRadius: 999,
        background: active ? "#EFF6FF" : "#fff",
        border: `1px solid ${active ? "#93C5FD" : "#E2E6EE"}`,
        color: active ? "#2563EB" : "#0F1422",
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
