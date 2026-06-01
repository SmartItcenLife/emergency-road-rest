import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

/**
 * usePostDetail — 게시글 상세 상태 + 로직
 * @param {string} hpid
 * @param {string} postId
 * @param {object|null} user - 현재 로그인 유저
 */
export function usePostDetail(hpid, postId, user) {
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

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
    if (!user)
      return navigate("/login", {
        state: { from: location.pathname.replace(/\/$/, "") },
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
        state: { from: location.pathname.replace(/\/$/, "") },
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

  // 수정 저장
  async function handleSubmitEdit(newContent) {
    if (!editing) return;
    await updateComment(hpid, postId, editing.id, newContent);
    setComments((cs) =>
      cs.map((c) => (c.id === editing.id ? { ...c, content: newContent } : c)),
    );
    setEditing(null);
  }

  // 댓글 삭제 확인 요청
  function handleAskDeleteComment(commentId) {
    setConfirmTarget({ kind: "comment", target: commentId });
  }

  // 게시글 삭제 확인 요청
  function handleAskDeletePost() {
    setConfirmTarget({ kind: "post", target: postId });
  }

  // 확인 모달 승인
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

  const [reportTarget, setReportTarget] = useState(null);
// 신고 메서드(1.게시글, 2.댓글)
  function handleAskReportPost(){
    if(!user){
      return navigate("/login",{
        state: {from:location.pathname.replace(/\/$/, "")},
      });
    }

    console.log("게시글 신고 버튼 클릭");

    setReportTarget({
      kind: "post",
      target: postId
    });
  }

  function handleAskReportComment(commentId){
    if(!user){
      return navigate("/login",{
        state: {from:location.pathname.replace(/\/$/, "")},
      })
    }

    setReportTarget({
      kind: "comment",
      target: commentId
    });
  }
// 신고 처리 메서드(type 별로 나눔)
  async function handleSubmitReport(reason){
    if(!reportTarget) return;

    if(reportTarget.kind==="post"){
      await reportPost(hpid, postId, reason);
    } else {
      await reportComment(hpid, postId, reportTarget.target, reason);
    }

    setReportTarget(null);
    alert("신고가 접수되었습니다.");
  }

  return {
    post,
    comments,
    loading,
    editing,
    confirmTarget,
    setConfirmTarget,
    handleLike,
    handleCommentLike,
    handleAddComment,
    handleStartEdit,
    handleCancelEdit,
    handleSubmitEdit,
    handleAskDeleteComment,
    handleAskDeletePost,
    handleConfirmDelete,
    handleAskReportPost,
    handleAskReportComment,
    handleSubmitReport,
    reportTarget,
    setReportTarget,
  };
}

export default usePostDetail;
