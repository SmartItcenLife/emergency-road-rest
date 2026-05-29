import { Icon } from "../../../shared/components/ui/Primitives";


const BORDER1 = "#E2E6EE";
const INK2 = "#404757";
const ACCENT = "#2563EB";

/**
 * PostLikeBar — 좋아요 / 댓글수 액션바
 */
export function PostLikeBar({ isLiked, recommendCount, commentCount, onLike, handleAskReportPost }) {
  return (
    <div
      style={{
        padding: "12px 20px",
        borderTop: `1px solid ${BORDER1}`,
        borderBottom: `1px solid ${BORDER1}`,
        display: "flex",
        gap: 24,
        fontSize: 13,
        color: INK2,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <button
        onClick={onLike}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          color: isLiked ? ACCENT : INK2,
          fontWeight: isLiked ? 600 : 500,
          fontSize: 13,
        }}
      >
        <Icon
          name="heart"
          size={16}
          style={{ fill: isLiked ? ACCENT : "none" }}
        />
        {recommendCount}
      </button>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <Icon name="message" size={16} /> {commentCount}
      </span>

      
    </div>
  );
}

export default PostLikeBar;
