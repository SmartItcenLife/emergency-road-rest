import { useState } from "react";
import { Icon } from "../../../shared/components/ui/Primitives";

const SURFACE_SUNK = "#EEF1F6";
const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";

export function CommentComposer({ onSubmit, disabled }) {
  const [val, setVal] = useState("");

  function send() {
    if (!val.trim() || disabled) return;
    onSubmit(val.trim());
    setVal("");
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 430,
        margin: "0 auto",
        background: "#fff",
        borderTop: `1px solid ${BORDER1}`,
        padding: "10px 14px",
        display: "flex",
        gap: 8,
        alignItems: "center",
        zIndex: 20,
      }}
    >
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={
          disabled
            ? "로그인 후 댓글을 남길 수 있어요"
            : "따뜻한 한마디를 남겨 주세요"
        }
        disabled={disabled}
        onKeyDown={(e) => e.key === "Enter" && send()}
        style={{
          flex: 1,
          font: "400 14px inherit",
          padding: "10px 14px",
          border: `1px solid ${BORDER1}`,
          borderRadius: 999,
          background: SURFACE_SUNK,
          color: INK1,
          outline: "none",
        }}
      />
      <button
        onClick={send}
        disabled={!val.trim() || disabled}
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          border: "none",
          background: val.trim() && !disabled ? ACCENT : SURFACE_SUNK,
          color: val.trim() && !disabled ? "white" : INK3,
          cursor: val.trim() && !disabled ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="send" size={18} strokeWidth={2} />
      </button>
    </div>
  );
}

export default CommentComposer;
