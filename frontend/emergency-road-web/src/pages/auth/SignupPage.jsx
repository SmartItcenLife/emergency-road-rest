import { useNavigate } from "react-router-dom";
import { AppBar, Icon } from "../../shared/components/ui/Primitives";
import { useSignup } from "../../features/auth/hooks/useSignup";
import { SignupForm } from "../../features/auth/components/signup/SignupForm";
import { SignupSuccess } from "../../features/auth/components/signup/SignupSuccess";

const SURFACE = "#FFFFFF";
const INK1 = "#0F1422";

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useSignup();

  if (signup.done) {
    return <SignupSuccess onLogin={() => navigate("/login")} />;
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
        title="회원가입"
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
      />
      <SignupForm {...signup} />
    </div>
  );
}
