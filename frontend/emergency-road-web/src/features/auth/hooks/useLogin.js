import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../app/providers/AuthProvider";

/**
 * useLogin — 로그인 폼 상태 + API 호출
 *
 * 반환값:
 * - id, pw, show, err, loading : 폼 상태
 * - onChangeId, onChangePw     : 입력 핸들러
 * - onToggleShow               : 비밀번호 표시 토글
 * - onSubmit                   : 로컬 로그인 제출
 * - onKakao                    : 카카오 로그인 시작
 */
export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e?.preventDefault?.();
    if (!id.trim() || !pw.trim()) {
      setErr("아이디와 비밀번호를 모두 입력해 주세요");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      await login({ userName: id.trim(), password: pw });
      const from = (location.state?.from || "/").replace(/\/$/, "");
      const safeTo = from === "/login" ? "/" : from;
      navigate(safeTo, { replace: true });
    } catch (error) {
      setErr(error.message || "아이디 또는 비밀번호를 확인해 주세요");
    } finally {
      setLoading(false);
    }
  }

  async function onKakao() {
    try {
      const from = (location.state?.from || location.pathname).replace(
        /\/$/,
        "",
      );
      sessionStorage.setItem("loginFrom", from);
      const res = await fetch("/api/auth/kakao/redirect");
      const data = await res.json();
      window.location.href = data.data;
    } catch {
      alert("카카오 로그인을 시작할 수 없어요. 잠시 후 다시 시도해 주세요.");
    }
  }

  return {
    id,
    pw,
    show,
    err,
    loading,
    onChangeId: (e) => setId(e.target.value),
    onChangePw: (e) => setPw(e.target.value),
    onToggleShow: () => setShow((s) => !s),
    onSubmit,
    onKakao,
  };
}

export default useLogin;
