import { Link } from "react-router-dom";
import { Button, Field, Input, Icon } from "../../../../shared/components/ui";
import { PasswordStrength } from "./PasswordStrength";
import { ProfileImagePicker } from "./ProfileImagePicker";
import "./SignupForm.css";

/**
 * SignupForm — 회원가입 폼 UI
 * 상태/로직은 useSignup hook에서 관리, 여기선 UI만
 */
export function SignupForm({
  form,
  errors,
  touched,
  valid,
  loading,
  serverError,
  showPw,
  previewUrl,
  onChangeField,
  onBlurField,
  onTogglePw,
  onChangeImage,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="signup-form">
      {/* 프로필 이미지 */}
      <ProfileImagePicker previewUrl={previewUrl} onChange={onChangeImage} />

      {/* 서버 에러 */}
      {serverError && (
        <div className="signup-form__server-error">{serverError}</div>
      )}

      {/* 아이디 */}
      <Field
        label="아이디"
        error={touched.userName && errors.userName}
        hint={!touched.userName ? "영문과 숫자를 포함해 6~20자" : undefined}
      >
        <Input
          value={form.userName}
          onChange={onChangeField("userName")}
          onBlur={onBlurField("userName")}
          placeholder="user123"
          maxLength={20}
          autoComplete="username"
        />
      </Field>

      {/* 비밀번호 */}
      <Field label="비밀번호" error={touched.password && errors.password}>
        <Input
          value={form.password}
          onChange={onChangeField("password")}
          onBlur={onBlurField("password")}
          type={showPw ? "text" : "password"}
          placeholder="영문+숫자+특수문자, 8자 이상"
          rightSlot={
            <button
              type="button"
              onClick={onTogglePw}
              className="signup-form__pw-toggle"
            >
              <Icon name={showPw ? "eyeOff" : "eye"} size={18} />
            </button>
          }
        />
        <PasswordStrength value={form.password} />
      </Field>

      {/* 닉네임 */}
      <Field
        label="닉네임"
        error={touched.nickname && errors.nickname}
        hint={!touched.nickname ? `${form.nickname.length}/30` : undefined}
      >
        <Input
          value={form.nickname}
          onChange={onChangeField("nickname")}
          onBlur={onBlurField("nickname")}
          placeholder="다른 사용자에게 보일 이름"
          maxLength={30}
        />
      </Field>

      {/* 이메일 */}
      <Field label="이메일" error={touched.email && errors.email}>
        <Input
          type="email"
          value={form.email}
          onChange={onChangeField("email")}
          onBlur={onBlurField("email")}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!valid || loading}
      >
        {loading ? "가입 중..." : "회원 가입"}
      </Button>

      <p className="signup-form__footer">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="signup-form__login-link">
          로그인
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;
