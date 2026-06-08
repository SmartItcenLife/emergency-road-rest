import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../app/providers/AuthProvider";
import { Icon } from "../../shared/components/ui";
import "./KakaoCallbackPage.css";

export default function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuthContext();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("인증 코드가 없어요.");
      return;
    }

    fetch(`/api/auth/kakao?code=${code}`, { credentials: "include" })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data.data?.accessToken) throw new Error(data.message);
        localStorage.setItem("accessToken", data.data.accessToken);
        await refreshUser();

        const from = sessionStorage.getItem("loginFrom") || "/";
        sessionStorage.removeItem("loginFrom");
        navigate(from, { replace: true });
      })
      .catch((err) => setError(err.message || "카카오 로그인에 실패했어요."));
  }, []);

  if (error) {
    return (
      <div className="kakao-callback-page">
        <div className="kakao-callback-page__inner">
          <div className="kakao-callback-page__error-icon">
            <Icon name="x" size={36} color="#DC2626" strokeWidth={2.5} />
          </div>
          <h2 className="kakao-callback-page__error-title">로그인에 실패했어요</h2>
          <p className="kakao-callback-page__error-message">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="kakao-callback-page__retry-btn"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kakao-callback-page--loading">
      <div className="kakao-callback-page__loading-text">
        카카오 로그인 처리 중...
      </div>
    </div>
  );
}
