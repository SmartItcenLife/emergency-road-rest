// 전역 관리
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getMe,
  login as apiLogin,
  logout as apiLogout,
  refreshToken,
} from "../../features/auth/api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 토큰 복원
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await getMe();
        setUser(me);
      } catch (e) {
        // AccessToken 만료 → refreshToken 쿠키로 재발급 시도
        try {
          const tokens = await refreshToken();
          localStorage.setItem("accessToken", tokens.accessToken);
          const me = await getMe();
          setUser(me);
        } catch {
          localStorage.removeItem("accessToken");
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (credentials) => {
    const tokens = await apiLogin(credentials);
    localStorage.setItem("accessToken", tokens.accessToken);
    const me = await getMe();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
