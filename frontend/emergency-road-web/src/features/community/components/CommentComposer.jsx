import { useState, useEffect, useRef } from "react";
import { Icon } from "../../../shared/components/ui";
import "./CommentComposer.css";

const SURFACE_SUNK = "#EEF1F6";
const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";

export function CommentComposer({ editing, onSubmit, disabled, onCancelEdit }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);

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
  const canSend = val.trim() && !disabled;

  return (
    <div className="comment-composer">
      {isEdit && (
        <div className="comment-composer__edit-banner">
          <Icon name="check" size={14} strokeWidth={2} />
          <span className="comment-composer__edit-label">댓글 수정 중</span>
          <span className="comment-composer__edit-preview">· {editing.content}</span>
          <button className="comment-composer__cancel-btn" onClick={onCancelEdit}>
            <Icon name="x" size={16} />
          </button>
        </div>
      )}

      <div className="comment-composer__input-row">
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
          className="comment-composer__input"
          style={{
            border: `1px solid ${isEdit ? "#93C5FD" : BORDER1}`,
            background: isEdit ? "#fff" : SURFACE_SUNK,
          }}
        />
        <button
          onClick={send}
          disabled={!canSend}
          className="comment-composer__send-btn"
          style={{
            minWidth: isEdit ? 48 : 36,
            padding: isEdit ? "0 14px" : 0,
            background: canSend ? ACCENT : SURFACE_SUNK,
            color: canSend ? "white" : INK3,
            cursor: canSend ? "pointer" : "not-allowed",
          }}
        >
          {isEdit ? "저장" : <Icon name="send" size={18} strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
}

export default CommentComposer;
