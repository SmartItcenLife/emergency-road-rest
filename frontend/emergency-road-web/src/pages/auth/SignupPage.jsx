import { useNavigate } from "react-router-dom";
import { AppBar, Icon } from "../../shared/components/ui";
import { useSignup } from "../../features/auth/hooks/useSignup";
import { SignupForm } from "../../features/auth/components/signup/SignupForm";
import { SignupSuccess } from "../../features/auth/components/signup/SignupSuccess";
import "./SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useSignup();

  if (signup.done) {
    return <SignupSuccess onLogin={() => navigate("/login")} />;
  }

  return (
    <div className="signup-page">
      <AppBar
        title="회원가입"
        leftAction={
          <button
            onClick={() => navigate(-1)}
            className="signup-page__back-btn"
          >
            <Icon name="arrowLeft" size={22} />
          </button>
        }
      />
      <SignupForm {...signup} />
    </div>
  );
}
