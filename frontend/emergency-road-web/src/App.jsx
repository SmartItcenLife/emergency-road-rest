
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './shared/components/layout/Header';
import Home from './pages/Home';
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUserListPage from './pages/admin/AdminUserListPage.jsx'
import AdminPostListPage from './pages/admin/AdminPostListPage.jsx';
import AdminReportListPage from './pages/admin/AdminReportListPage.jsx';
import HospitalRecommendPage from './pages/hospital/HospitalRecommendPage.jsx';
import MapPage from './pages/map/MapPage';
import HospitalListPage from './pages/hospital/HospitalListPage.jsx';

// 헤더를 감싸는 래퍼 컴포넌트
const Layout = () => {
  const location = useLocation();
  
  // 현재 경로에 따라 헤더 타입을 결정하는 로직
  const getHeaderType = () => {
    const path = location.pathname;
    if (path=== '/') return 'home';
    if(path.startsWith("/admin")){  return "admin";  }
    // if (location.pathname.startsWith('/recommend')) return 'recommend';
    // if (location.pathname.startsWith('/community')) return 'community';
    return 'home';
  };

  return (
    <>
      <Header type={getHeaderType()} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 어드민 */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUserListPage />} />
        <Route path="/admin/posts" element={<AdminPostListPage />} />
        <Route path="/admin/reports" element={<AdminReportListPage/>} />
        {/* 지도 */}
        <Route path="/map" element={<MapPage />} />
        {/* 추천 및 전체 보기 */}
        <Route path="/recommend/:category" element={<HospitalRecommendPage />} />
        <Route path="/:category/hospitals" element={<HospitalListPage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;