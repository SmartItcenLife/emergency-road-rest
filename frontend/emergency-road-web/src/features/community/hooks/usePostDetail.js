import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPost,
  togglePostLike,
  getComments,
  createComment,
  updateComment,
  toggleCommentLike,
  deletePost,
  deleteComment,
} from "../api/api";

/**
 * usePostDetail — 게시글 상세 상태 + 로직
 * @param {string} hpid
 * @param {string} postId
 * @param {object|null} user - 현재 로그인 유저
 */
export function usePostDetail(hpid, postId, user) {
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, cs] = await Promise.all([
          getPost(hpid, postId),
          getComments(hpid, postId),
        ]);
        setPost(p);
        setComments(cs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [hpid, postId]);

  async function handleLike() {
    if (!user) return navigate("/login");
    const isLiked = await togglePostLike(hpid, postId);
    setPost((p) => ({
      ...p,
      isLiked,
      recommendCount: p.recommendCount + (isLiked ? 1 : -1),
    }));
  }

  async function handleCommentLike(commentId) {
    if (!user) return navigate("/login");
    const isLiked = await toggleCommentLike(hpid, postId, commentId);
    setComments((cs) =>
      cs.map((c) =>
        c.id === commentId
          ? { ...c, isLiked, likeCount: c.likeCount + (isLiked ? 1 : -1) }
          : c,
      ),
    );
  }

  async function handleAddComment(content) {
    await createComment(hpid, postId, content);
    const cs = await getComments(hpid, postId);
    setComments(cs);
  }

  async function handleEditComment(comment) {
    const newContent = prompt("댓글을 수정해 주세요", comment.content);
    if (!newContent || newContent === comment.content) return;
    await updateComment(hpid, postId, comment.id, newContent);
    setComments((cs) =>
      cs.map((c) => (c.id === comment.id ? { ...c, content: newContent } : c)),
    );
  }

  async function handleDeleteComment(commentId) {
    if (!confirm("댓글을 삭제할까요?")) return;
    await deleteComment(hpid, postId, commentId);
    setComments((cs) => cs.filter((c) => c.id !== commentId));
  }

  async function handleDeletePost() {
    if (!confirm("이 글을 삭제할까요? 삭제하면 되돌릴 수 없어요.")) return;
    await deletePost(hpid, postId);
    navigate(`/community/${hpid}`, { replace: true });
  }

  return {
    post,
    comments,
    loading,
    handleLike,
    handleCommentLike,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleDeletePost,
  };
}

export default usePostDetail;
