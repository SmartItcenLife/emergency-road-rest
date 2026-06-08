import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../app/providers/AuthProvider";
import { Icon } from "../../shared/components/ui";

const SURFACE = "#FFFFFF";
const ACCENT = "#2563EB";
const INK1 = "#0F1422";
const INK3 = "#7B8392";

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

        // 로그인 성공후 로직
        const from = sessionStorage.getItem("loginFrom") || "/";
        sessionStorage.removeItem("loginFrom"); // 사용 후 삭제
        navigate(from, { replace: true });
      })
      .catch((err) => setError(err.message || "카카오 로그인에 실패했어요."));
  }, []);

  /* ── 에러 화면 ── */
  if (error) {
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
              background: "#FEF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Icon name="x" size={36} color="#DC2626" strokeWidth={2.5} />
          </div>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 22,
              fontWeight: 700,
              color: INK1,
            }}
          >
            로그인에 실패했어요
          </h2>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: 15,
              color: "#404757",
              lineHeight: 1.6,
            }}
          >
            {error}
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              font: "600 16px inherit",
              color: "#fff",
              background: ACCENT,
              border: "none",
              borderRadius: 12,
              padding: "14px 24px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  /* ── 처리 중 ── */
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: SURFACE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", color: INK3, fontSize: 15 }}>
        카카오 로그인 처리 중...
      </div>
    </div>
  );
}
