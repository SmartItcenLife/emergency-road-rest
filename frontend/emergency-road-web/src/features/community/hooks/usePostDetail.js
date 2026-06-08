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
  reportPost,
  reportComment,
} from "../api/api";
import { saveLastCommunityLocation } from "../utils/communityLocation";

/**
 * usePostDetail — 게시글 상세 상태 + 로직
 * @param {string} hpid
 * @param {string} postId
 * @param {object|null} user - 현재 로그인 유저
 */
export function usePostDetail(hpid, postId, user) {
  const navigate = useNavigate();
  const boardPath = `/community/${hpid}`;
  const detailPath = `${boardPath}/posts/${postId}`;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (hpid && postId) {
      saveLastCommunityLocation({ hpid, postId });
    }
  }, [hpid, postId]);

  useEffect(() => {
    async function load() {
      try {
        const [p, cs] = await Promise.all([
          getPost(hpid, postId),
          getComments(hpid, postId),
        ]);
        setPost(p);
        setComments(cs);
        saveLastCommunityLocation({
          hpid,
          postId,
          hospitalName: p?.hospitalName,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [hpid, postId]);

  async function handleLike() {
    if (!user)
      return navigate("/login", {
        state: { from: detailPath },
      });
    const isLiked = await togglePostLike(hpid, postId);
    setPost((p) => ({
      ...p,
      isLiked,
      recommendCount: p.recommendCount + (isLiked ? 1 : -1),
    }));
  }

  async function handleCommentLike(commentId) {
    if (!user)
      return navigate("/login", {
        state: { from: detailPath },
      });
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

  function handleStartEdit(comment) {
    setEditing(comment);
  }

  function handleCancelEdit() {
    setEditing(null);
  }

  async function handleSubmitEdit(newContent) {
    if (!editing) return;
    await updateComment(hpid, postId, editing.id, newContent);
    setComments((cs) =>
      cs.map((c) => (c.id === editing.id ? { ...c, content: newContent } : c)),
    );
    setEditing(null);
  }

  function handleAskDeleteComment(commentId) {
    setConfirmTarget({ kind: "comment", target: commentId });
  }

  function handleAskDeletePost() {
    setConfirmTarget({ kind: "post", target: postId });
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    if (confirmTarget.kind === "post") {
      await deletePost(hpid, postId);
      navigate(`/community/${hpid}`, { replace: true });
    } else {
      await deleteComment(hpid, postId, confirmTarget.target);
      setComments((cs) => cs.filter((c) => c.id !== confirmTarget.target));
    }
    setConfirmTarget(null);
  }

  function handleCloseConfirm() {
    setConfirmTarget(null);
  }

  function handleAskReportPost() {
    if (!user) {
      return navigate("/login", { state: { from: detailPath } });
    }
    setReportTarget({ kind: "post", target: postId });
  }

  function handleAskReportComment(commentId) {
    if (!user) {
      return navigate("/login", { state: { from: detailPath } });
    }
    setReportTarget({ kind: "comment", target: commentId });
  }

  async function handleSubmitReport(reason) {
    if (!reportTarget) return;
    try {
      if (reportTarget.kind === "post") {
        await reportPost(hpid, postId, reason);
      } else {
        await reportComment(hpid, postId, reportTarget.target, reason);
      }
      setReportTarget(null);
      setReportSuccess(true);
    } catch (err) {
      alert(err.message || "신고 처리에 실패했어요.");
    }
  }

  function handleCloseReport() {
    setReportTarget(null);
  }

  function handleCloseReportSuccess() {
    setReportSuccess(false);
  }

  return {
    post,
    comments,
    loading,
    editing,
    confirmTarget,
    handleLike,
    handleCommentLike,
    handleAddComment,
    handleStartEdit,
    handleCancelEdit,
    handleSubmitEdit,
    handleAskDeleteComment,
    handleAskDeletePost,
    handleConfirmDelete,
    handleCloseConfirm,
    handleAskReportPost,
    handleAskReportComment,
    handleSubmitReport,
    reportTarget,
    handleCloseReport,
    reportSuccess,
    handleCloseReportSuccess,
  };
}

export default usePostDetail;
