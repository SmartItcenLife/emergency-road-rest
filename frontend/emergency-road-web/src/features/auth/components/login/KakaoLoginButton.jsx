import { Button } from "../../../../shared/components/ui/Primitives";

const KAKAO_FG = "#181600";

/**
 * KakaoLoginButton
 * @param {function} onClick - 카카오 로그인 시작 핸들러
 */
export function KakaoLoginButton({ onClick }) {
  return (
    <Button variant="kakao" size="lg" fullWidth onClick={onClick}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill={KAKAO_FG}
        style={{ marginRight: 4 }}
      >
        <path d="M9 1.5C4.86 1.5 1.5 4.1 1.5 7.3c0 2.06 1.4 3.87 3.53 4.9-.16.56-.58 2.05-.66 2.37 0 0-.01.13.07.18.08.05.17.01.17.01.24-.03 2.79-1.83 3.23-2.13.39.05.78.08 1.16.08 4.14 0 7.5-2.6 7.5-5.81S13.14 1.5 9 1.5Z" />
      </svg>
      카카오 로그인
    </Button>
  );
}

export default KakaoLoginButton;
