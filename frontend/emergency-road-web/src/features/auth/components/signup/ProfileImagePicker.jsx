import { useRef } from "react";
import { Icon } from "../../../../shared/components/ui";
import "./ProfileImagePicker.css";

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
    <div className="profile-image-picker">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="profile-image-picker__btn"
        style={previewUrl ? { background: `center/cover url(${previewUrl})` } : undefined}
      >
        {!previewUrl && <Icon name="camera" size={28} />}
        <span className="profile-image-picker__badge">
          <Icon name="plus" size={16} strokeWidth={2.5} />
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="profile-image-picker__input"
      />
    </div>
  );
}

export default ProfileImagePicker;
