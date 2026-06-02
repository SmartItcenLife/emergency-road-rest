import { Icon } from "../../../shared/components/ui";

const SURFACE = "#FFFFFF";
const SURFACE_SUNK = "#EEF1F6";
const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK3 = "#7B8392";

export function PostSearchBar({ keyword, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        padding: "12px 16px",
        background: SURFACE,
        borderBottom: `1px solid ${BORDER1}`,
      }}
    >
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: INK3,
            display: "flex",
            pointerEvents: "none",
          }}
        >
          <Icon name="search" size={16} />
        </span>
        <input
          value={keyword}
          onChange={onChange}
          placeholder="게시글 검색"
          style={{
            width: "100%",
            font: "400 14px inherit",
            padding: "10px 12px 10px 36px",
            border: `1px solid ${BORDER1}`,
            borderRadius: 999,
            background: SURFACE_SUNK,
            color: INK1,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
    </form>
  );
}

export default PostSearchBar;
