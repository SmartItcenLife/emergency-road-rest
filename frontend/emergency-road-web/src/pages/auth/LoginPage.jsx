import { Wordmark } from "../../shared/components/ui";
import { useLogin } from "../../features/auth/hooks/useLogin";
import { LoginForm } from "../../features/auth/components/login/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  const login = useLogin();

  return (
    <div className="login-page">
      {/* 브랜드 헤더 */}
      <div className="login-page__header">
        <Wordmark size={36} />
        <p className="login-page__subtitle">
          지금 갈 수 있는 응급실,
          <br />
          그리고 다녀온 사람들의 이야기.
        </p>
      </div>

      <LoginForm {...login} />
    </div>
  );
}
