import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../app/providers/AuthProvider";
import { updateMe } from "../../features/auth/api/api";
import {
  AppBar,
  Avatar,
  Button,
  Field,
  Input,
  Icon,
  ConfirmModal,
} from "../../shared/components/ui";
import "./MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuthContext();

  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [previewUrl, setPreviewUrl] = useState(user?.profileImageUrl ?? null);
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    setNickname(user?.nickname ?? "");
    setPreviewUrl(user?.profileImageUrl ?? null);
  }, [user]);

  const dirty = nickname !== user?.nickname || profileFile !== null;
  const nicknameErr = !nickname.trim()
    ? "닉네임을 입력해야 해요"
    : nickname.length > 30
      ? "30자 이내로 입력해 주세요"
      : null;

  function pickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setProfileFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function save() {
    if (nicknameErr) return;
    setLoading(true);
    try {
      await updateMe({ nickname, profileImage: profileFile });
      await refreshUser();
      setEditing(false);
      setProfileFile(null);
    } catch (err) {
      alert(err.message || "저장에 실패했어요.");
    } finally {
      setLoading(false);
    }
  }

  function cancel() {
    setNickname(user?.nickname ?? "");
    setPreviewUrl(user?.profileImageUrl ?? null);
    setProfileFile(null);
    setEditing(false);
  }

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="my-page">
      <AppBar
        title="마이페이지"
        leftAction={
          <button onClick={() => navigate(-1)} className="my-page__back-btn">
            <Icon name="arrowLeft" size={22} />
          </button>
        }
        rightAction={
          editing ? (
            <button onClick={cancel} className="my-page__cancel-btn">취소</button>
          ) : (
            <button onClick={() => setEditing(true)} className="my-page__edit-btn">편집</button>
          )
        }
      />

      <div className="my-page__profile-block">
        <button
          onClick={() => editing && fileRef.current?.click()}
          disabled={!editing}
          className="my-page__avatar-btn"
          style={{ cursor: editing ? "pointer" : "default" }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="프로필"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
              className="my-page__profile-img"
            />
          ) : null}
          {!previewUrl && <Avatar name={user?.nickname} size={96} />}
          {previewUrl && (
            <span className="my-page__fallback-avatar">
              <Avatar name={user?.nickname} size={96} />
            </span>
          )}
          {editing && (
            <span className="my-page__camera-badge">
              <Icon name="camera" size={14} />
            </span>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={pickFile}
          className="my-page__file-input"
        />

        {editing ? (
          <div className="my-page__nickname-field">
            <Field
              label="닉네임"
              error={nicknameErr}
              hint={!nicknameErr ? `${nickname.length}/30` : undefined}
            >
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
              />
            </Field>
          </div>
        ) : (
          <div className="my-page__info">
            <div className="my-page__name">{user?.nickname}</div>
            <div className="my-page__email">{user?.email}</div>
          </div>
        )}

        {editing && (
          <Button
            variant="primary"
            fullWidth
            onClick={save}
            disabled={!dirty || !!nicknameErr || loading}
          >
            {loading ? "저장 중..." : "저장"}
          </Button>
        )}
      </div>

      <div className="my-page__logout-wrap">
        <Button
          variant="danger"
          fullWidth
          onClick={() => setLogoutConfirm(true)}
          leftIcon="logout"
        >
          로그아웃
        </Button>
      </div>

      <ConfirmModal
        open={logoutConfirm}
        title="로그아웃"
        message="로그아웃 할까요?"
        confirmLabel="로그아웃"
        cancelLabel="취소"
        danger={false}
        onConfirm={handleLogout}
        onClose={() => setLogoutConfirm(false)}
      />
    </div>
  );
}
