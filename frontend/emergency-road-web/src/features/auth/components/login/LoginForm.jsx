import { Link } from "react-router-dom";
import { Button, Field, Input, Icon } from "../../../../shared/components/ui";
import { KakaoLoginButton } from "./KakaoLoginButton";
import "./LoginForm.css";

/**
 * LoginForm — 로그인 폼 UI
 * 상태/로직은 useLogin hook에서 관리
 */
export function LoginForm({
  id,
  pw,
  show,
  err,
  loading,
  onChangeId,
  onChangePw,
  onToggleShow,
  onSubmit,
  onKakao,
}) {
  return (
    <div className="login-form">
      <form onSubmit={onSubmit} className="login-form__fields">
        <Field
          label="아이디"
          error={err && !id.trim() ? "아이디를 입력해 주세요" : undefined}
        >
          <Input
            value={id}
            onChange={onChangeId}
            placeholder="6~20자, 영문+숫자"
            autoComplete="username"
          />
        </Field>

        <Field
          label="비밀번호"
          error={
            err && id.trim() && !pw.trim()
              ? "비밀번호를 입력해 주세요"
              : err && id.trim() && pw.trim()
                ? err
                : undefined
          }
        >
          <Input
            type={show ? "text" : "password"}
            value={pw}
            onChange={onChangePw}
            placeholder="영문+숫자+특수문자, 8자 이상"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && onSubmit(e)}
            rightSlot={
              <button
                type="button"
                onClick={onToggleShow}
                className="login-form__pw-toggle"
              >
                <Icon name={show ? "eyeOff" : "eye"} size={18} />
              </button>
            }
          />
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      {/* 구분선 */}
      <div className="login-form__divider">
        <span className="login-form__divider-line" />
        <span>또는</span>
        <span className="login-form__divider-line" />
      </div>

      {/* 카카오 로그인 */}
      <KakaoLoginButton onClick={onKakao} />

      {/* 회원가입 유도 */}
      <div className="login-form__footer">
        응급길이 처음이신가요?{" "}
        <Link to="/signup" className="login-form__signup-link">
          회원가입
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
