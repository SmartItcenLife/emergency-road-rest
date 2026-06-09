import { Avatar, Icon } from "../../../shared/components/ui";
import { MoreMenu } from "./MoreMenu";
import { formatDateShort } from "../utils/dateFormat";
import "./CommentItem.css";

const ACCENT = "#2563EB";
const INK3 = "#7B8392";

/**
 * CommentItem — 댓글 아이템
 */
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
    <div className={`comment-item${isReportedComment ? " reported-comment" : ""}`}>
      <Avatar name={c.nickname} src={c.profileImageUrl} size={32} />
      <div className="comment-item__body">
        <div className="comment-item__meta">
          <span className="comment-item__nickname">{c.nickname}</span>
          <span className="comment-item__date">· {formatDateShort(c.createdAt)}</span>
          {(c.userId === myId || isAdmin) && (
            <div className="comment-item__more">
              <MoreMenu
                size={16}
                topOffset={24}
                onEdit={c.userId === myId ? () => onEdit(c) : undefined}
                onDelete={() => onDelete(c.id)}
              />
            </div>
          )}
        </div>
        <p className="comment-item__content">{c.content}</p>
        <div className="comment-item__actions">
          <button
            className="comment-item__like-btn"
            onClick={() => onLike(c.id)}
            style={{ color: c.isLiked ? ACCENT : INK3 }}
          >
            <Icon
              name="heart"
              size={13}
              style={{ fill: c.isLiked ? ACCENT : "none" }}
            />{" "}
            {c.likeCount}
          </button>

          {myId && myId !== c.userId && (
            <button
              type="button"
              className="comment-item__report-btn"
              onClick={() => onReport(c.id)}
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
