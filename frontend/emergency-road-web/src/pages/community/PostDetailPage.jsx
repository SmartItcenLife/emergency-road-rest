import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../app/providers/AuthProvider";
import { usePostDetail } from "../../features/community/hooks/usePostDetail";
import { PostBody } from "../../features/community/components/PostBody";
import { PostLikeBar } from "../../features/community/components/PostLikeBar";
import { MoreMenu } from "../../features/community/components/MoreMenu";
import { CommentItem } from "../../features/community/components/CommentItem";
import { CommentComposer } from "../../features/community/components/CommentComposer";
import {
  AppBar,
  Avatar,
  Icon,
  ConfirmModal,
} from "../../shared/components/ui/Primitives";
import { formatDate } from "../../features/community/utils/dateFormat";
import ReportModal from "../../features/community/components/ReportModal";

const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";
const ACCENT_SOFT = "#EFF6FF";

export default function PostDetailPage() {
  const { hpid, postId } = useParams();
  const navigate = useNavigate();
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
  } = usePostDetail(hpid, postId, user);

  if (loading)
    return (
      <div style={{ padding: "60px 24px", textAlign: "center", color: INK3 }}>
        불러오는 중...
      </div>
    );
  if (!post)
    return (
      <div style={{ padding: "60px 24px", textAlign: "center", color: INK3 }}>
        삭제됐거나 없는 글이에요.
      </div>
    );

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
    <div
      style={{
        minHeight: "100dvh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        paddingBottom: 72,
        maxWidth: 430,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <AppBar
        title="게시글 상세"
        leftAction={
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "none",
              padding: 8,
              color: INK1,
              cursor: "pointer",
            }}
          >
            <Icon name="arrowLeft" size={22} />
          </button>
        }
        rightAction={
          (isMyPost || isAdmin) && (
            <MoreMenu
              onEdit={() => navigate(`/community/${hpid}/posts/${postId}/edit`)}
              onDelete={handleAskDeletePost}
            />
          )
        }
      />

      {/* 병원 칩 */}
      <div style={{ padding: "12px 20px 0", display: "flex" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: ACCENT_SOFT,
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            color: ACCENT,
            fontWeight: 600,
            border: "1px solid #DBEAFE",
          }}
        >
          <Icon name="mapPin" size={12} />
          {post.hospitalName}
        </span>
      </div>

      {/* 작성자 */}
      <div
        style={{
          padding: "10px 20px 0",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Avatar name={post.nickname} src={post.profileImageUrl} size={36} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT }}>
            {post.nickname}
          </div>
          <div
            style={{
              fontSize: 12,
              color: INK3,
              fontVariantNumeric: "tabular-nums",
            }}
          >
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

      {/* 게시글 신고하기 버튼 */}
      {user && user.userId !== post.userId && (
        <div>
          <button
          type="button"
          onClick={handleAskReportPost}
          style={{
              cursor: "pointer",
              border: "1px solid #ebeef2",
              background: "#ffffff",
              color: "#505866",
              minWidth: 36,
              height: 36,
              padding: "0 12px",
              borderRadius: 8,
              fontWeight: 700,
              transition: "all 0.2s ease",
              margin: "15px"
                }}
          >
            게시글 신고하기
          </button>
        </div>
      )}

      {/* 댓글 헤더 */}
      <div
        style={{
          padding: "16px 20px 8px",
          fontSize: 13,
          fontWeight: 600,
          color: "#404757",
          textAlign: "left",
        }}
      >
        댓글{" "}
        <span
          style={{
            color: ACCENT,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {comments.length}
        </span>
      </div>

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <div
          style={{
            padding: "32px 24px",
            textAlign: "center",
            color: INK3,
            fontSize: 14,
          }}
        >
          첫 댓글을 남겨 주세요.
        </div>
      ) : (
        comments.map((c) => (
          <CommentItem
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

      <div style={{ height: 80 }} />
      <CommentComposer
        editing={editing}
        onSubmit={handleComposerSubmit}
        onCancelEdit={handleCancelEdit}
        disabled={!user}
      />

      {/* 삭제 확인 모달 */}
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

      {/* 게시글 신고 모달 창(사유) 띄우기 */}
      <ReportModal
        open={!!reportTarget}
        type={reportTarget?.kind}
        onSubmit={handleSubmitReport}
        onClose={()=>setReportTarget(null)}
      />
    </div>
  );
}
