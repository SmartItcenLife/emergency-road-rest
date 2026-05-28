import { Button, Icon } from "../../../../shared/components/ui/Primitives";

const SURFACE = "#FFFFFF";
const ACCENT = "#2563EB";
const INK1 = "#0F1422";

/**
 * SignupSuccess — 회원가입 완료 화면
 * @param {function} onLogin - 로그인 버튼 클릭 핸들러
 */
export function SignupSuccess({ onLogin }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: SURFACE,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 32px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#EFF6FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Icon name="check" size={36} color={ACCENT} strokeWidth={2.5} />
        </div>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 22,
            fontWeight: 700,
            color: INK1,
            letterSpacing: "-0.02em",
          }}
        >
          회원가입 완료!
        </h2>
        <p
          style={{
            margin: "0 0 32px",
            fontSize: 15,
            color: "#404757",
            lineHeight: 1.6,
          }}
        >
          응급길에 오신 걸 환영해요.
          <br />
          로그인해서 시작해 보세요.
        </p>
        <Button variant="primary" size="lg" fullWidth onClick={onLogin}>
          로그인 하러 가기
        </Button>
      </div>
    </div>
  );
}

export default SignupSuccess;
