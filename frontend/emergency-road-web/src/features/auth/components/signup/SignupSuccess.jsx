import { Button, Icon } from "../../../../shared/components/ui";
import "./SignupSuccess.css";

const ACCENT = "#2563EB";

/**
 * SignupSuccess — 회원가입 완료 화면
 * @param {function} onLogin - 로그인 버튼 클릭 핸들러
 */
export function SignupSuccess({ onLogin }) {
  return (
    <div className="signup-success">
      <div className="signup-success__body">
        <div className="signup-success__icon-wrap">
          <Icon name="check" size={36} color={ACCENT} strokeWidth={2.5} />
        </div>
        <h2 className="signup-success__title">회원가입 완료!</h2>
        <p className="signup-success__desc">
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
