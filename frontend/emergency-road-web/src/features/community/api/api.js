/**
 * Community API
 * DTO 필드: post.id, post.recommendCount, post.isLiked, post.hospitalName
 *           comment.id, comment.likeCount, comment.isLiked
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/** 이미지 URL 정규화 — 상대경로 → 절대경로, 이중 슬래시 제거 */
function normalizeImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const clean = url.replace(/\/\/+/g, "/"); // // → /
  return clean.startsWith("/") ? `${API_URL}${clean}` : clean;
}

/** post 응답의 imageUrls 정규화 */
function normalizePost(post) {
  if (!post) return post;
  return {
    ...post,
    imageUrls: post.imageUrls?.map(normalizeImageUrl) ?? [],
    profileImageUrl: normalizeImageUrl(post.profileImageUrl),
  };
}

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const base = (hpid) => `/api/hospitals/${hpid}/posts`;

export async function getHospital(hpid) {
  const res = await fetch(`/api/hospitals/${hpid}`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "병원 정보를 불러오는데 실패했어요.");
  return data.data;
}

// ── 게시글 ────────────────────────────────────────────────────────────────────

/** GET /api/hospitals/{hpid}/posts?page=&keyword= → Page<PostResponseDto> */
export async function getPosts(hpid, { page = 0, keyword, size = 5 } = {}) {
  const params = new URLSearchParams({ page, size });
  if (keyword) params.set("keyword", keyword);
  const res = await fetch(`${base(hpid)}?${params}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "게시글 목록을 불러오는데 실패했어요.");
  const pageData = data.data;
  if (pageData?.content) pageData.content = pageData.content.map(normalizePost);
  return pageData; // { content, totalPages, last, ... }
}

/** GET /api/hospitals/{hpid}/posts/{postId} → PostResponseDto */
export async function getPost(hpid, postId) {
  const res = await fetch(`${base(hpid)}/${postId}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "게시글을 불러오는데 실패했어요.");
  return normalizePost(data.data);
}

/** POST /api/hospitals/{hpid}/posts (multipart/form-data) */
export async function createPost(hpid, { title, content, images = [] }) {
  const form = new FormData();
  form.append("title", title);
  form.append("content", content);
  images.forEach((img) => form.append("images", img));
  const res = await fetch(`${base(hpid)}`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "게시글 작성에 실패했어요.");
  return data.data;
}

/** PUT /api/hospitals/{hpid}/posts/{postId} (multipart/form-data) */
export async function updatePost(
  hpid,
  postId,
  { title, content, images = [] },
) {
  const form = new FormData();
  form.append("title", title);
  form.append("content", content);
  images.forEach((img) => form.append("images", img));
  const res = await fetch(`${base(hpid)}/${postId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "게시글 수정에 실패했어요.");
  return data;
}

/** DELETE /api/hospitals/{hpid}/posts/{postId} */
export async function deletePost(hpid, postId) {
  const res = await fetch(`${base(hpid)}/${postId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "게시글 삭제에 실패했어요.");
  return data;
}

// ── 좋아요 ────────────────────────────────────────────────────────────────────

/** POST /api/hospitals/{hpid}/posts/{postId}/like */
export async function togglePostLike(hpid, postId) {
  const res = await fetch(`${base(hpid)}/${postId}/like`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "좋아요 처리에 실패했어요.");
  return data.data;
}

/** POST /api/hospitals/{hpid}/posts/{postId}/comments/{commentId}/like */
export async function toggleCommentLike(hpid, postId, commentId) {
  const res = await fetch(
    `${base(hpid)}/${postId}/comments/${commentId}/like`,
    { method: "POST", headers: authHeaders() },
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "댓글 좋아요 처리에 실패했어요.");
  return data.data;
}

// ── 댓글 ────────────────────────────────────────────────────────────────────

/** GET /api/hospitals/{hpid}/posts/{postId}/comments → CommentResponseDto[] */
export async function getComments(hpid, postId) {
  const res = await fetch(`${base(hpid)}/${postId}/comments`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "댓글을 불러오는데 실패했어요.");
  return (
    data.data?.map((c) => ({
      ...c,
      profileImageUrl: normalizeImageUrl(c.profileImageUrl),
    })) ?? []
  );
}

/** POST /api/hospitals/{hpid}/posts/{postId}/comments */
export async function createComment(hpid, postId, content) {
  const res = await fetch(`${base(hpid)}/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "댓글 작성에 실패했어요.");
  return data;
}

/** PUT /api/hospitals/{hpid}/posts/{postId}/comments/{commentId} */
export async function updateComment(hpid, postId, commentId, content) {
  const res = await fetch(`${base(hpid)}/${postId}/comments/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "댓글 수정에 실패했어요.");
  return data;
}

/** DELETE /api/hospitals/{hpid}/posts/{postId}/comments/{commentId} */
export async function deleteComment(hpid, postId, commentId) {
  const res = await fetch(`${base(hpid)}/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "댓글 삭제에 실패했어요.");
  return data;
}

// 게시글 신고
export async function reportPost(hpid, postId, reason) {
  const response = await fetch(`${base(hpid)}/${postId}/report`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ reason }),
  });

  const data = await response.json();

  if (!response.ok)
    throw new Error(data.message || "게시글 신고에 실패했어요.");
  return data;
}

// 댓글 신고
export async function reportComment(hpid, postId, commentId, reason) {
  const response = await fetch(
    `${base(hpid)}/${postId}/comments/${commentId}/report`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ reason }),
    },
  );
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "댓글 신고에 실패했어요.");
  return data;
}
