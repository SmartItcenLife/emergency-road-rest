// src/shared/components/ui/ConfirmModal.jsx
import { Icon } from "./Icon";

if (
  typeof document !== "undefined" &&
  !document.getElementById("eg-modal-anims")
) {
  const s = document.createElement("style");
  s.id = "eg-modal-anims";
  s.textContent = `
    @keyframes egScrim   { from { opacity: 0 } to { opacity: 1 } }
    @keyframes egSheetUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
    @keyframes egModalIn { from { opacity: 0; transform: scale(0.94) } to { opacity: 1; transform: scale(1) } }
  `;
  document.head.appendChild(s);
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "삭제",
  cancelLabel = "취소",
  danger = true,
  onConfirm,
  onClose,
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1001,
        background: "rgba(15,20,34,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        animation: "egScrim 200ms ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 320,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 48px -12px rgba(15,20,34,0.28)",
          animation: "egModalIn 220ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 17,
              fontWeight: 700,
              color: "#0F1422",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h3>
          {message && (
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#404757",
                lineHeight: 1.55,
              }}
            >
              {message}
            </p>
          )}
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #E2E6EE" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "15px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              font: "600 15px inherit",
              color: "#404757",
              borderRight: "1px solid #E2E6EE",
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onClose?.();
              onConfirm?.();
            }}
            style={{
              flex: 1,
              padding: "15px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              font: "700 15px inherit",
              color: danger ? "#DC2626" : "#2563EB",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
