import { useParams, useNavigate } from "react-router-dom";
import { usePostForm } from "../../features/community/hooks/usePostForm";
import { PostImagePicker } from "../../features/community/components/PostImagePicker";
import { AppBar, Icon } from "../../shared/components/ui";
import "./PostFormPage.css";

const ACCENT = "#2563EB";
const INK3 = "#7B8392";

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
    <div className="post-form-page">
      <AppBar
        title={isEdit ? "게시글 수정" : "글 쓰기"}
        leftAction={
          <button onClick={() => navigate(-1)} className="post-form-page__back-btn">
            <Icon name="arrowLeft" size={22} />
          </button>
        }
        rightAction={
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="post-form-page__submit-btn"
            style={{
              cursor: canSubmit ? "pointer" : "default",
              color: canSubmit ? ACCENT : INK3,
            }}
          >
            {loading ? "저장 중..." : "완료"}
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="post-form-page__form">
        <div className="post-form-page__title-wrap">
          <input
            value={title}
            onChange={onTitleChange}
            placeholder="제목을 입력하세요"
            maxLength={100}
            className="post-form-page__title-input"
          />
        </div>

        <div className="post-form-page__divider" />

        <div className="post-form-page__content-wrap">
          <textarea
            value={content}
            onChange={onContentChange}
            placeholder="응급실 후기나 궁금한 점을 자유롭게 남겨 주세요."
            className="post-form-page__content-input"
          />
        </div>

        <PostImagePicker images={images} onChange={onImagesChange} />
      </form>
    </div>
  );
}
