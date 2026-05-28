import { useRef } from "react";
import { Icon } from "../../../shared/components/ui/Primitives";

const SURFACE_SUNK = "#EEF1F6";
const BORDER1 = "#E2E6EE";
const BORDER2 = "#CDD3DD";
const INK3 = "#7B8392";

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
    <div
      style={{
        padding: "0 20px 20px",
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        borderTop: `1px solid ${BORDER1}`,
        paddingTop: 16,
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            width: 80,
            height: 80,
            borderRadius: 10,
            overflow: "hidden",
            border: `1px solid ${BORDER1}`,
            flexShrink: 0,
          }}
        >
          <img
            src={URL.createObjectURL(img)}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            type="button"
            onClick={() => removeImage(i)}
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 20,
              height: 20,
              borderRadius: 999,
              background: "rgba(15,20,34,0.6)",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
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
            style={{
              width: 80,
              height: 80,
              borderRadius: 10,
              border: `1.5px dashed ${BORDER2}`,
              background: SURFACE_SUNK,
              color: INK3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "inherit",
              flexShrink: 0,
            }}
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
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  );
}

export default PostImagePicker;
