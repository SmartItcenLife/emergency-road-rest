
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './shared/components/layout/Header';
import Home from './pages/Home';
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUserListPage from './pages/admin/AdminUserListPage.jsx'
import AdminPostListPage from './pages/admin/AdminPostListPage.jsx';
import AdminReportListPage from './pages/admin/AdminReportListPage.jsx';
import MapPage from './pages/map/MapPage';

// 헤더를 감싸는 래퍼 컴포넌트
const Layout = () => {
  const location = useLocation();
  
  // 현재 경로에 따라 헤더 타입을 결정하는 로직
  const getHeaderType = () => {
    if (location.pathname === '/') return 'home';
    if(location.pathname.startsWith("/admin")){  return "admin";  }
    // if (location.pathname.startsWith('/recommend')) return 'recommend';
    // if (location.pathname.startsWith('/community')) return 'community';
    return 'home';
  };

  return (
    <>
      <Header type={getHeaderType()} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUserListPage />} />
        <Route path="/admin/posts" element={<AdminPostListPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/admin/reports" element={<AdminReportListPage/>} />
        {/* <Route path="/recommend" element={<Recommend />} />
        <Route path="/community" element={<Community />} /> */}
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />

    </BrowserRouter>
  );
}

export default App;