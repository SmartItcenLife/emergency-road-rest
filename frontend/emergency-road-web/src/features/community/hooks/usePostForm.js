import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPost, createPost, updatePost } from "../api/api";

/**
 * usePostForm — 게시글 작성/수정 상태 + 로직
 * @param {string} hpid
 * @param {string|undefined} postId - 있으면 수정 모드
 */
export function usePostForm(hpid, postId) {
  const navigate = useNavigate();
  const isEdit = Boolean(postId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 수정 모드 — 기존 데이터 로드
  useEffect(() => {
    if (!isEdit) return;
    getPost(hpid, postId).then((p) => {
      setTitle(p.title);
      setContent(p.content);
    });
  }, [hpid, postId, isEdit]);

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await updatePost(hpid, postId, { title, content, images });
        navigate(`/community/${hpid}/posts/${postId}`, { replace: true });
      } else {
        await createPost(hpid, { title, content, images });
        navigate(`/community/${hpid}`, { replace: true });
      }
    } catch (err) {
      alert(err.message || "저장에 실패했어요.");
    } finally {
      setLoading(false);
    }
  }

  return {
    isEdit,
    title,
    onTitleChange: (e) => setTitle(e.target.value),
    content,
    onContentChange: (e) => setContent(e.target.value),
    images,
    onImagesChange: setImages,
    loading,
    handleSubmit,
  };
}

export default usePostForm;
