import React from 'react';
import '../../../../src/styles/admin/AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="admin-header">

      <div className="admin-logo">
        관리자 페이지
      </div>

      <nav className="admin-menu">
        <a href="/admin/users">회원관리</a>
        <a href="/admin/report">신고관리</a>
        <a href="/admin/hospital">병원관리</a>
      </nav>

      <button>로그아웃</button>

    </header>
  );
};

export default AdminHeader;