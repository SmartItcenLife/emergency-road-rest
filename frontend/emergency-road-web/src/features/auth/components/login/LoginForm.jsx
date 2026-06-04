import { Link } from "react-router-dom";
import { Button, Field, Input, Icon } from "../../../../shared/components/ui";
import { KakaoLoginButton } from "./KakaoLoginButton";

const BORDER1 = "#E2E6EE";
const INK2 = "#404757";
const INK3 = "#7B8392";
const ACCENT = "#2563EB";

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
    <div
      style={{
        padding: "4px 24px 24px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
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
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  color: INK3,
                  display: "flex",
                }}
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: INK3,
          fontSize: 12,
          margin: "24px 0 14px",
        }}
      >
        <span style={{ flex: 1, height: 1, background: BORDER1 }} />
        <span>또는</span>
        <span style={{ flex: 1, height: 1, background: BORDER1 }} />
      </div>

      {/* 카카오 로그인 */}
      <KakaoLoginButton onClick={onKakao} />

      {/* 회원가입 유도 */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 28,
          textAlign: "center",
          fontSize: 13,
          color: INK2,
        }}
      >
        응급길이 처음이신가요?{" "}
        <Link
          to="/signup"
          style={{ color: ACCENT, fontWeight: 600, textDecoration: "none" }}
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
