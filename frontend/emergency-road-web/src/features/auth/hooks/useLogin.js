import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../../app/providers/AuthProvider";
import { getKakaoRedirectUrl } from "../api/api";

export function useLogin() {
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
      // GuestRoute가 location.state.from을 읽어 redirect 처리
    } catch (error) {
      setErr(error.message || "아이디 또는 비밀번호를 확인해 주세요");
    } finally {
      setLoading(false);
    }
  }

  async function onKakao() {
    try {
      const from = (location.state?.from || "/").replace(/\/$/, "");
      sessionStorage.setItem("loginFrom", from);
      const redirectUrl = await getKakaoRedirectUrl();
      window.location.href = redirectUrl;
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
