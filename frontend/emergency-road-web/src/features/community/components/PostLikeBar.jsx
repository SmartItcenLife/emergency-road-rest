import { Icon } from "../../../shared/components/ui";
import "./PostLikeBar.css";

const INK2 = "#404757";
const ACCENT = "#2563EB";

/**
 * PostLikeBar — 좋아요 / 댓글수 액션바
 */
export function PostLikeBar({ isLiked, recommendCount, commentCount, onLike }) {
  return (
    <div className="post-like-bar">
      <button
        onClick={onLike}
        className="post-like-bar__like-btn"
        style={{ color: isLiked ? ACCENT : INK2, fontWeight: isLiked ? 600 : 500 }}
      >
        <Icon
          name="heart"
          size={16}
          style={{ fill: isLiked ? ACCENT : "none" }}
        />
        {recommendCount}
      </button>
      <span className="post-like-bar__comment">
        <Icon name="message" size={16} /> {commentCount}
      </span>
    </div>
  );
}

export default PostLikeBar;
