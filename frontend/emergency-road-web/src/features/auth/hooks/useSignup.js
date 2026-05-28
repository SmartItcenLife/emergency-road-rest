import { useState } from "react";
import { signup } from "../api/api";

const ID_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * useSignup — 회원가입 폼 상태 + 유효성 검사 + API 호출
 *
 * 반환값:
 * - form, errors, touched, valid        : 폼 상태
 * - profileImage, previewUrl            : 이미지 상태
 * - showPw, loading, serverError, done  : UI 상태
 * - onChangeField, onBlurField          : 핸들러
 * - onTogglePw, onChangeImage, onSubmit : 핸들러
 */
export function useSignup() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    nickname: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // ── 유효성 검사 ─────────────────────────────────────────────────────────────
  const errors = {
    userName: !form.userName
      ? "아이디는 입력해야 해요"
      : !ID_REGEX.test(form.userName)
        ? "영문과 숫자를 포함해 6~20자로 입력해 주세요"
        : null,
    password: !form.password
      ? null
      : !PW_REGEX.test(form.password)
        ? "조건을 모두 만족해 주세요"
        : null,
    nickname: !form.nickname
      ? "닉네임을 입력해야 해요"
      : form.nickname.length > 30
        ? "30자 이내로 입력해 주세요"
        : null,
    email: !form.email
      ? "이메일을 입력해야 해요"
      : !EMAIL_REGEX.test(form.email)
        ? "이메일 형식이 올바르지 않아요"
        : null,
  };
  const valid =
    !errors.userName &&
    PW_REGEX.test(form.password) &&
    !errors.nickname &&
    !errors.email;

  // ── 핸들러 ───────────────────────────────────────────────────────────────────
  const onChangeField = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const onBlurField = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const onTogglePw = () => setShowPw((s) => !s);

  function onChangeImage(file) {
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ userName: true, password: true, nickname: true, email: true });
    if (!valid) return;
    setServerError(null);
    setLoading(true);
    try {
      await signup({ ...form, profileImage });
      setDone(true);
    } catch (err) {
      setServerError(
        err.message || "회원가입에 실패했어요. 다시 시도해 주세요.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    errors,
    touched,
    valid,
    profileImage,
    previewUrl,
    showPw,
    loading,
    serverError,
    done,
    onChangeField,
    onBlurField,
    onTogglePw,
    onChangeImage,
    onSubmit,
  };
}

export default useSignup;
