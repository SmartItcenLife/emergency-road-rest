import { Wordmark } from "../../shared/components/ui";
import { useLogin } from "../../features/auth/hooks/useLogin";
import { LoginForm } from "../../features/auth/components/login/LoginForm";

const SURFACE = "#FFFFFF";
const INK2 = "#404757";

export default function LoginPage() {
  const login = useLogin();

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
      {/* 브랜드 헤더 */}
      <div style={{ padding: "40px 24px 28px" }}>
        <Wordmark size={36} />
        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            color: INK2,
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
          }}
        >
          지금 갈 수 있는 응급실,
          <br />
          그리고 다녀온 사람들의 이야기.
        </p>
      </div>

      <LoginForm {...login} />
    </div>
  );
}
