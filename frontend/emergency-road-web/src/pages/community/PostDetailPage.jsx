import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useAuthContext } from "../../app/providers/AuthProvider";
import { usePostDetail } from "../../features/community/hooks/usePostDetail";
import { PostBody } from "../../features/community/components/PostBody";
import { PostLikeBar } from "../../features/community/components/PostLikeBar";
import { MoreMenu } from "../../features/community/components/MoreMenu";
import { CommentItem } from "../../features/community/components/CommentItem";
import { CommentComposer } from "../../features/community/components/CommentComposer";
import { AppBar, Avatar, Icon, ConfirmModal } from "../../shared/components/ui";
import { formatDate } from "../../features/community/utils/dateFormat";
import ReportModal from "../../features/community/components/ReportModal";
import "./PostDetailPage.css";

export default function PostDetailPage() {
  const { hpid, postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const {
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
    reportSuccess,
    setReportSuccess,
  } = usePostDetail(hpid, postId, user);

  const [searchParams] = useSearchParams();
  const commentId = searchParams.get("commentId");

  if (loading)
    return <div className="post-detail-page__loading">불러오는 중...</div>;
  if (!post)
    return <div className="post-detail-page__loading">삭제됐거나 없는 글이에요.</div>;

  const isMyPost = user?.userId === post.userId;
  const isAdmin = user?.role === "ADMIN";

  function handleComposerSubmit(text) {
    if (editing) {
      handleSubmitEdit(text);
    } else {
      handleAddComment(text);
    }
  }

  return (
    <div className="post-detail-page">
      <AppBar
        title="게시글 상세"
        leftAction={
          <button onClick={() => navigate(-1)} className="post-detail-page__back-btn">
            <Icon name="arrowLeft" size={22} />
          </button>
        }
        rightAction={
          !user ? (
            <button
              onClick={() =>
                navigate("/login", {
                  state: { from: location.pathname.replace(/\/$/, "") },
                })
              }
              className="post-detail-page__login-btn"
            >
              로그인
            </button>
          ) : (
            <div className="post-detail-page__appbar-actions">
              <button
                onClick={() => navigate("/mypage")}
                className="post-detail-page__avatar-btn"
              >
                <Avatar name={user.nickname} src={user.profileImageUrl} size={28} />
              </button>
              {(isMyPost || isAdmin) && (
                <MoreMenu
                  onEdit={() =>
                    navigate(`/community/${hpid}/posts/${postId}/edit`)
                  }
                  onDelete={handleAskDeletePost}
                />
              )}
            </div>
          )
        }
      />

      <div className="post-detail-page__body">
        <div className="post-detail-page__hospital-chip-wrap">
          <span className="post-detail-page__hospital-chip">
            <Icon name="mapPin" size={12} />
            {post.hospitalName}
          </span>
        </div>

        <div className="post-detail-page__author">
          <Avatar name={post.nickname} src={post.profileImageUrl} size={36} />
          <div>
            <div className="post-detail-page__author-nickname">{post.nickname}</div>
            <div className="post-detail-page__author-date">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        <PostBody
          title={post.title}
          content={post.content}
          imageUrls={post.imageUrls}
        />

        <PostLikeBar
          isLiked={post.isLiked}
          recommendCount={post.recommendCount}
          commentCount={comments.length}
          onLike={handleLike}
        />

        {user && user.userId !== post.userId && (
          <div>
            <button
              type="button"
              onClick={handleAskReportPost}
              className="post-detail-page__report-btn"
            >
              게시글 신고하기
            </button>
          </div>
        )}

        <div className="post-detail-page__comment-header">
          댓글{" "}
          <span className="post-detail-page__comment-count">{comments.length}</span>
        </div>

        {comments.length === 0 ? (
          <div className="post-detail-page__comment-empty">첫 댓글을 남겨 주세요.</div>
        ) : (
          comments.map((c) => (
            <CommentItem
              isReportedComment={String(c.id) == commentId}
              key={c.id}
              c={c}
              onLike={handleCommentLike}
              onEdit={handleStartEdit}
              onDelete={handleAskDeleteComment}
              onReport={handleAskReportComment}
              myId={user?.userId}
              isAdmin={isAdmin}
            />
          ))
        )}

        <div className="post-detail-page__spacer" />
        <CommentComposer
          editing={editing}
          onSubmit={handleComposerSubmit}
          onCancelEdit={handleCancelEdit}
          disabled={!user}
        />

        <ConfirmModal
          open={!!confirmTarget}
          title={confirmTarget?.kind === "post" ? "게시글 삭제" : "댓글 삭제"}
          message={
            confirmTarget?.kind === "post"
              ? "이 게시글을 삭제할까요?"
              : "댓글을 삭제할까요?"
          }
          confirmLabel="삭제"
          cancelLabel="취소"
          danger
          onConfirm={handleConfirmDelete}
          onClose={() => setConfirmTarget(null)}
        />

        <ReportModal
          open={!!reportTarget}
          type={reportTarget?.kind}
          onSubmit={handleSubmitReport}
          onClose={() => setReportTarget(null)}
        />

        {reportSuccess && (
          <div
            className="post-detail-page__report-toast"
            onClick={() => setReportSuccess(false)}
          >
            신고가 접수되었습니다.
          </div>
        )}
      </div>
    </div>
  );
}
