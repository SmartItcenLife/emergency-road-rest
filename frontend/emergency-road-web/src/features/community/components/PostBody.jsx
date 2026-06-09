import "./PostBody.css";

/**
 * PostBody — 게시글 제목 + 본문 + 이미지
 */
export function PostBody({ title, content, imageUrls }) {
  return (
    <div className="post-body">
      <h1 className="post-body__title">{title}</h1>
      <p className="post-body__content">{content}</p>
      {imageUrls?.map((url, i) => (
        <img key={i} src={url} alt="" className="post-body__image" />
      ))}
    </div>
  );
}

export default PostBody;
