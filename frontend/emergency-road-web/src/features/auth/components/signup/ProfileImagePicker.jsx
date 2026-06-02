import { useRef } from "react";
import { Icon } from "../../../../shared/components/ui";

const ACCENT = "#2563EB";
const SURFACE_SUNK = "#EEF1F6";
const BORDER2 = "#CDD3DD";
const INK3 = "#7B8392";

/**
 * ProfileImagePicker
 * @param {string|null} previewUrl - 미리보기 URL
 * @param {function} onChange - (file) => void
 */
export function ProfileImagePicker({ previewUrl, onChange }) {
  const fileRef = useRef(null);

  function handleChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    onChange(f);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 4,
        marginBottom: 4,
      }}
    >
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        style={{
          width: 96,
          height: 96,
          borderRadius: 999,
          position: "relative",
          border: `1px dashed ${BORDER2}`,
          background: previewUrl
            ? `center/cover url(${previewUrl})`
            : SURFACE_SUNK,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: INK3,
          padding: 0,
        }}
      >
        {!previewUrl && <Icon name="camera" size={28} />}
        <span
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: 28,
            height: 28,
            borderRadius: 999,
            background: ACCENT,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid white",
          }}
        >
          <Icon name="plus" size={16} strokeWidth={2.5} />
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default ProfileImagePicker;
