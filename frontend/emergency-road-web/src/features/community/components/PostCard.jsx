import { Avatar, Icon } from "../../../shared/components/ui/Primitives";
import { formatDateShort } from "../utils/dateFormat";

const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK2 = "#404757";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";

export function PostCard({ post, onOpen }) {
  return (
    <article
      onClick={onOpen}
      style={{
        background: "#fff",
        padding: "16px 20px",
        cursor: "pointer",
        borderBottom: `1px solid ${BORDER1}`,
        textAlign: "left",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Avatar name={post.nickname} src={post.profileImageUrl} size={28} />
        <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>
          {post.nickname}
        </span>
        <span
          style={{
            fontSize: 12,
            color: INK3,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          · {formatDateShort(post.createdAt)}
        </span>
      </header>
      <h3
        style={{
          margin: "2px 0 4px",
          fontSize: 16,
          fontWeight: 600,
          color: INK1,
          letterSpacing: "-0.01em",
          lineHeight: 1.4,
        }}
      >
        {post.title}
      </h3>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 14,
          color: INK2,
          lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {post.content}
      </p>
      {post.imageUrls?.[0] && (
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 10,
            background: `center/cover url(${post.imageUrls[0]})`,
            marginBottom: 10,
            border: `1px solid ${BORDER1}`,
          }}
        />
      )}
      <footer
        style={{
          display: "flex",
          gap: 16,
          color: INK2,
          fontSize: 12,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: post.isLiked ? ACCENT : INK2,
          }}
        >
          <Icon
            name="heart"
            size={14}
            style={{ fill: post.isLiked ? ACCENT : "none" }}
          />
          {post.recommendCount}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Icon name="message" size={14} />
          {post.commentCount}
        </span>
      </footer>
    </article>
  );
}

export default PostCard;
