import { Avatar, Icon } from "../../../shared/components/ui";
import { formatDateShort } from "../utils/dateFormat";
import "./PostCard.css";

const ACCENT = "#2563EB";
const INK2 = "#404757";

export function PostCard({ post, onOpen }) {
  return (
    <article className="post-card" onClick={onOpen}>
      <header className="post-card__header">
        <Avatar name={post.nickname} src={post.profileImageUrl} size={28} />
        <span className="post-card__nickname">{post.nickname}</span>
        <span className="post-card__date">· {formatDateShort(post.createdAt)}</span>
      </header>
      <h3 className="post-card__title">{post.title}</h3>
      <p className="post-card__content">{post.content}</p>
      {post.imageUrls?.[0] && (
        <div
          className="post-card__thumbnail"
          style={{ background: `center/cover url(${post.imageUrls[0]})` }}
        />
      )}
      <footer className="post-card__footer">
        <span
          className="post-card__like"
          style={{ color: post.isLiked ? ACCENT : INK2 }}
        >
          <Icon
            name="heart"
            size={14}
            style={{ fill: post.isLiked ? ACCENT : "none" }}
          />
          {post.recommendCount}
        </span>
        <span className="post-card__comment">
          <Icon name="message" size={14} />
          {post.commentCount}
        </span>
      </footer>
    </article>
  );
}

export default PostCard;
