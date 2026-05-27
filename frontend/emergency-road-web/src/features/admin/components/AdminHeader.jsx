import React from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="admin-header">

      <div className="admin-logo">
        <a href="/admin">관리자 페이지</a>
      </div>

      <nav className="admin-menu">
        <a href="/admin/users">회원관리</a>
        <a href="/admin/report">신고관리</a>
        <a href="/admin/hospital">커뮤니티 전체보기</a>
      </nav>

      <button>로그아웃</button>

    </header>
  );
};

export default AdminHeader;