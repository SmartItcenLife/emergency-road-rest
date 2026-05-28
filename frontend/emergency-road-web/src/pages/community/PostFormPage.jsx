import { useParams, useNavigate } from "react-router-dom";
import { usePostForm } from "../../features/community/hooks/usePostForm";
import { PostImagePicker } from "../../features/community/components/PostImagePicker";
import { AppBar, Icon } from "../../shared/components/ui/Primitives";

const SURFACE = "#FFFFFF";
const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";

export default function PostFormPage() {
  const { hpid, postId } = useParams();
  const navigate = useNavigate();
  const {
    isEdit,
    title,
    onTitleChange,
    content,
    onContentChange,
    images,
    onImagesChange,
    loading,
    handleSubmit,
  } = usePostForm(hpid, postId);

  const canSubmit = title.trim() && content.trim() && !loading;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: SURFACE,
        display: "flex",
        flexDirection: "column",
        maxWidth: 430,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <AppBar
        title={isEdit ? "게시글 수정" : "글 쓰기"}
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
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              background: "transparent",
              border: "none",
              padding: "8px 12px",
              cursor: canSubmit ? "pointer" : "default",
              fontSize: 15,
              fontWeight: 600,
              color: canSubmit ? ACCENT : INK3,
            }}
          >
            {loading ? "저장 중..." : "완료"}
          </button>
        }
      />

      <form
        onSubmit={handleSubmit}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* 제목 */}
        <div style={{ padding: "20px 20px 0" }}>
          <input
            value={title}
            onChange={onTitleChange}
            placeholder="제목을 입력하세요"
            maxLength={100}
            style={{
              width: "100%",
              font: "600 20px inherit",
              color: INK1,
              border: "none",
              outline: "none",
              background: "transparent",
              letterSpacing: "-0.02em",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{ margin: "16px 20px 0", height: 1, background: BORDER1 }}
        />

        {/* 본문 */}
        <div style={{ padding: "16px 20px", flex: 1 }}>
          <textarea
            value={content}
            onChange={onContentChange}
            placeholder="응급실 후기나 궁금한 점을 자유롭게 남겨 주세요."
            style={{
              width: "100%",
              minHeight: 240,
              font: "400 15px/1.7 inherit",
              color: INK1,
              border: "none",
              outline: "none",
              background: "transparent",
              resize: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <PostImagePicker images={images} onChange={onImagesChange} />
      </form>
    </div>
  );
}
