const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";

/**
 * PostBody — 게시글 제목 + 본문 + 이미지
 */
export function PostBody({ title, content, imageUrls }) {
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <h1
        style={{
          margin: "0 0 12px",
          fontSize: 22,
          fontWeight: 700,
          color: INK1,
          letterSpacing: "-0.015em",
          lineHeight: 1.35,
          textAlign: "center",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          color: INK1,
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          textAlign: "left",
        }}
      >
        {content}
      </p>
      {imageUrls?.map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          style={{
            width: "100%",
            borderRadius: 12,
            marginTop: 14,
            border: `1px solid ${BORDER1}`,
            display: "block",
          }}
        />
      ))}
    </div>
  );
}

export default PostBody;
