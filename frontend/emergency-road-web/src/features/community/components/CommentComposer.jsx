import { useState, useEffect, useRef } from "react";
import { Icon } from "../../../shared/components/ui/Primitives";

const SURFACE_SUNK = "#EEF1F6";
const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK2 = "#404757";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";
const ACCENT_SOFT = "#EFF6FF";

export function CommentComposer({ editing, onSubmit, disabled, onCancelEdit }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);

  // 수정 모드 진입 시: 기존 내용 자동 입력 + 포커스
  useEffect(() => {
    if (editing) {
      setVal(editing.content);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setVal("");
    }
  }, [editing?.id]);

  function send() {
    if (!val.trim() || disabled) return;
    onSubmit(val.trim());
    if (!editing) setVal("");
  }

  const isEdit = !!editing;
  const showSend = val.trim().length > 0;

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
        display: "flex",
        gap: 8,
        flexDirection: "column",
        zIndex: 20,
      }}
    >
      {/* 수정 모드 배너 */}
      {isEdit && (
        <div
          style={{
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: ACCENT_SOFT,
            borderBottom: "1px solid #DBEAFE",
            fontSize: 12,
            color: ACCENT,
          }}
        >
          <Icon name="check" size={14} strokeWidth={2} />
          <span style={{ fontWeight: 600 }}>댓글 수정 중</span>
          <span
            style={{
              flex: 1,
              color: INK2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: 400,
            }}
          >
            · {editing.content}
          </span>
          <button
            onClick={onCancelEdit}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: INK2,
              display: "flex",
              padding: 2,
            }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      )}

      {/* 입력 행 */}
      <div
        style={{
          width: "100%",
          padding: "10px 12px",
          display: "flex",
          gap: 8,
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <input
          ref={inputRef}
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
            padding: "12px 16px",
            border: `1px solid ${isEdit ? "#93C5FD" : BORDER1}`,
            borderRadius: 999,
            background: isEdit ? "#fff" : SURFACE_SUNK,
            color: INK1,
            outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={!val.trim() || disabled}
          style={{
            minWidth: isEdit ? 48 : 36,
            whiteSpace: "nowrap",
            height: 40,
            padding: isEdit ? "0 14px" : 0,
            borderRadius: 999,
            border: "none",
            background: val.trim() && !disabled ? ACCENT : SURFACE_SUNK,
            color: val.trim() && !disabled ? "white" : INK3,
            cursor: val.trim() && !disabled ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            font: "600 13px inherit",
          }}
        >
          {isEdit ? "저장" : <Icon name="send" size={18} strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
}

export default CommentComposer;
