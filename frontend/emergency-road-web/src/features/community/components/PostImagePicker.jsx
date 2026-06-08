import { useRef } from "react";
import { Icon } from "../../../shared/components/ui";
import "./PostImagePicker.css";

const MAX_IMAGES = 5;

/**
 * PostImagePicker — 게시글 이미지 첨부 (최대 5장)
 */
export function PostImagePicker({ images, onChange }) {
  const fileRef = useRef(null);

  function addImages(e) {
    const files = Array.from(e.target.files || []);
    onChange([...images, ...files].slice(0, MAX_IMAGES));
    e.target.value = "";
  }

  function removeImage(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="post-image-picker">
      {images.map((img, i) => (
        <div key={i} className="post-image-picker__item">
          <img
            src={URL.createObjectURL(img)}
            alt=""
            className="post-image-picker__img"
          />
          <button
            type="button"
            onClick={() => removeImage(i)}
            className="post-image-picker__remove"
          >
            <Icon name="x" size={11} strokeWidth={2.5} />
          </button>
        </div>
      ))}
      {images.length < MAX_IMAGES && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="post-image-picker__add-btn"
          >
            <Icon name="image" size={20} />
            <span>사진 추가</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={addImages}
            className="post-image-picker__input"
          />
        </>
      )}
    </div>
  );
}

export default PostImagePicker;
