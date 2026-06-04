// ============================================================
// MyPage
// 출처: Design System / ui_kits/community/ProfileScreen.jsx
// 변경: React.useState/useRef → useState/useRef, props →
//       useAuthContext + updateMe API + useNavigate
// ============================================================
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

const ACCENT = "#2563EB";
const BORDER1 = "#E2E6EE";
const INK1 = "#0F1422";
const INK2 = "#404757";
const INK3 = "#7B8392";
const SURFACE = "#FFFFFF";

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

  // user 정보 갱신 시 previewUrl 동기화
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
        title="마이페이지"
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
          editing ? (
            <button
              onClick={cancel}
              style={{
                background: "transparent",
                border: "none",
                padding: "8px 10px",
                color: INK2,
                cursor: "pointer",
                font: "500 14px inherit",
              }}
            >
              취소
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "transparent",
                border: "none",
                padding: "8px 10px",
                color: ACCENT,
                cursor: "pointer",
                font: "600 14px inherit",
              }}
            >
              편집
            </button>
          )
        }
      />

      {/* 프로필 블록 */}
      <div
        style={{
          background: "#fff",
          padding: "32px 24px 28px",
          borderBottom: `1px solid ${BORDER1}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* 프로필 이미지 */}
        <button
          onClick={() => editing && fileRef.current?.click()}
          disabled={!editing}
          style={{
            position: "relative",
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: editing ? "pointer" : "default",
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="프로필"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 999,
                objectFit: "cover",
                border: `2px solid ${BORDER1}`,
                display: "block",
              }}
            />
          ) : null}
          {!previewUrl && <Avatar name={user?.nickname} size={96} />}
          {previewUrl && (
            <span style={{ display: "none" }}>
              <Avatar name={user?.nickname} size={96} />
            </span>
          )}
          {editing && (
            <span
              style={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 32,
                height: 32,
                borderRadius: 999,
                background: ACCENT,
                color: "white",
                border: "3px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="camera" size={14} />
            </span>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={pickFile}
          style={{ display: "none" }}
        />

        {/* 닉네임 — 편집 중이면 인풋, 아니면 텍스트 */}
        {editing ? (
          <div style={{ width: "100%", maxWidth: 280 }}>
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
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: INK1,
                letterSpacing: "-0.015em",
              }}
            >
              {user?.nickname}
            </div>
            <div style={{ fontSize: 13, color: INK3, marginTop: 4 }}>
              {user?.email}
            </div>
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

      {/* 로그아웃 */}
      <div style={{ padding: "20px 20px 28px" }}>
        <Button
          variant="danger"
          fullWidth
          onClick={() => setLogoutConfirm(true)}
          leftIcon="logout"
        >
          로그아웃
        </Button>
      </div>

      {/* 로그아웃 확인 모달 */}
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
