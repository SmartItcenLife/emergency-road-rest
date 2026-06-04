import { Avatar, Icon } from "../../../shared/components/ui";
import { MoreMenu } from "./MoreMenu";
import { formatDateShort } from "../utils/dateFormat";
import "./CommentItem.css";

const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";

/**
 * CommentItem — 댓글 아이템
 */
// 91번 줄에 신고 버튼 추가했습니다
export function CommentItem({
  c,
  onLike,
  onEdit,
  onDelete,
  onReport,
  myId,
  isAdmin,
  isReportedComment,
}) {
  return (
    <div
      className={isReportedComment ? "reported-comment" : ""}
      style={{
        display: "flex",
        gap: 10,
        padding: "14px 20px",
        borderBottom: `1px solid ${BORDER1}`,
        backgroundColor: isReportedComment ? "#FEE2E2" : "transparent",
        borderLeft: isReportedComment
          ? "4px solid #DC2626"
          : "4px solid transparent",
        borderRadius: "20px",
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
          {(c.userId === myId || isAdmin) && (
            <div style={{ marginLeft: "auto" }}>
              <MoreMenu
                size={16}
                topOffset={24}
                onEdit={c.userId === myId ? () => onEdit(c) : undefined}
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

          {/* 신고 버튼 추가 */}
          {myId && myId !== c.userId && (
            <button
              type="button"
              onClick={() => onReport(c.id)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#DC2626",
                fontWeight: 600,
                margin: "0 0 0 10px",
              }}
            >
              <Icon name="flag" size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
