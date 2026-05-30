import { Avatar, Icon } from "../../../shared/components/ui/Primitives";
import { MoreMenu } from "./MoreMenu";
import { formatDateShort } from "../utils/dateFormat";

const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";

/**
 * CommentItem — 댓글 아이템
 */
export function CommentItem({ c, onLike, onEdit, onDelete, myId }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "14px 20px",
        borderBottom: `1px solid ${BORDER1}`,
      }}
    >
      <Avatar name={c.nickname} src={c.profileImageUrl} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>
            {c.nickname}
          </span>
          <span
            style={{
              fontSize: 11,
              color: INK3,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            · {formatDateShort(c.createdAt)}
          </span>
          {c.userId === myId && (
            <div style={{ marginLeft: "auto" }}>
              <MoreMenu
                size={16}
                topOffset={24}
                onEdit={() => onEdit(c)}
                onDelete={() => onDelete(c.id)}
              />
            </div>
          )}
        </div>
        <p
          style={{
            margin: "0",
            fontSize: 14,
            color: INK1,
            lineHeight: 1.55,
            textAlign: "left",
          }}
        >
          {c.content}
        </p>
        <div style={{ textAlign: "left" }}>
          <button
            onClick={() => onLike(c.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              textAlign: "left",
              fontSize: 12,
              color: c.isLiked ? ACCENT : INK3,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <Icon
              name="heart"
              size={13}
              style={{ fill: c.isLiked ? ACCENT : "none" }}
            />{" "}
            {c.likeCount}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
