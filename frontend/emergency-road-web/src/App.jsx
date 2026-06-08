import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./shared/components/layout/Header";
import Home from "./pages/Home";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUserListPage from "./pages/admin/AdminUserListPage.jsx";
import AdminPostListPage from "./pages/admin/AdminPostListPage.jsx";
import AdminReportListPage from "./pages/admin/AdminReportListPage.jsx";
import HospitalRecommendPage from "./pages/hospital/HospitalRecommendPage.jsx";
import MapPage from "./pages/map/MapPage";
import HospitalListPage from "./pages/hospital/HospitalListPage.jsx";

import { AuthProvider, useAuthContext } from "./app/providers/AuthProvider.jsx";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import MyPage from "./pages/auth/MyPage";
import KakaoCallbackPage from "./pages/auth/KakaoCallbackPage";
import PostListPage from "./pages/community/PostListPage";
import PostDetailPage from "./pages/community/PostDetailPage";
import PostFormPage from "./pages/community/PostFormPage";


function getLoginRedirectPath(pathname) {
  return pathname.replace(/\/$/, "") || "/";
}

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  if (loading) return null;
  return user ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: getLoginRedirectPath(location.pathname) + location.search + location.hash }}
    />
  );
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  if (loading) return null;
  if (user) {
    if(user.role === "ADMIN"){
      return <Navigate to="/admin" replace/>;
    }
    const from = (location.state?.from || "/").replace(/\/$/, "");
    const safeTo = from === "/login" ? "/" : from;
    return <Navigate to={safeTo} replace />;
  }
  return user ? <Navigate to="/" replace /> : children;
};

// 헤더를 감싸는 래퍼 컴포넌트
const Layout = () => {
  const location = useLocation();

  const NO_HEADER = ["/login", "/signup", "/auth/kakao/callback"];
  const showHeader =
    !NO_HEADER.includes(location.pathname) &&
    !location.pathname.startsWith("/community");

  // 현재 경로에 따라 헤더 타입을 결정하는 로직
  const getHeaderType = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.startsWith("/admin")) {
      return "admin";
    }
    // if (location.pathname.startsWith('/recommend')) return 'recommend';
    // if (location.pathname.startsWith('/community')) return 'community';
    return "home";
  };

  return (
    <>
      {showHeader && <Header type={getHeaderType()} />}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />

        <Route path="/community/:hpid" element={<PostListPage />} />
        <Route
          path="/community/:hpid/posts/:postId"
          element={<PostDetailPage />}
        />
        <Route
          path="/community/:hpid/posts/new"
          element={
            <PrivateRoute>
              <PostFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/community/:hpid/posts/:postId/edit"
          element={
            <PrivateRoute>
              <PostFormPage />
            </PrivateRoute>
          }
        />

        {/* 어드민 */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUserListPage />} />
        <Route path="/admin/posts" element={<AdminPostListPage />} />
        <Route path="/admin/reports" element={<AdminReportListPage />} />
        {/* 지도 */}
        <Route path="/map" element={<MapPage />} />
        {/* 추천 및 전체 보기 */}
        <Route
          path="/recommend/:category"
          element={<HospitalRecommendPage />}
        />
        <Route path="/:category/hospitals" element={<HospitalListPage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
