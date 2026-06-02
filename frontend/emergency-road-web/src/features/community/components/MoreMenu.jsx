import { useState } from "react";
import { Icon } from "../../../shared/components/ui/Primitives";

const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK3 = "#7B8392";

/**
 * MoreMenu — 점점점 메뉴 (게시글/댓글 공용)
 * @param {function} onEdit
 * @param {function} onDelete
 * @param {number} size - 아이콘 크기 (기본 20)
 * @param {number} topOffset - 드롭다운 top 위치 (기본 36)
 */
export function MoreMenu({ onEdit, onDelete, size = 20, topOffset = 36 }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((s) => !s)}
        style={{
          background: "transparent",
          border: "none",
          padding: size === 20 ? 8 : 4,
          color: size === 20 ? INK1 : INK3,
          cursor: "pointer",
          display: "flex",
        }}
      >
        <Icon name="more" size={size} />
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 29 }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: topOffset,
              background: "#fff",
              border: `1px solid ${BORDER1}`,
              borderRadius: 12,
              boxShadow: "0 8px 24px -8px rgba(15,20,34,0.12)",
              minWidth: size === 20 ? 120 : 100,
              zIndex: 30,
              overflow: "hidden",
            }}
          >
            {onEdit && (
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              style={{
                width: "100%",
                padding: size === 20 ? "14px 16px" : "12px 14px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: size === 20 ? 14 : 13,
                color: INK1,
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              수정
            </button>
            )}
            <button
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              style={{
                width: "100%",
                padding: size === 20 ? "14px 16px" : "12px 14px",
                background: "transparent",
                border: "none",
                borderTop: `1px solid ${BORDER1}`,
                cursor: "pointer",
                fontSize: size === 20 ? 14 : 13,
                color: "#DC2626",
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MoreMenu;
