import React from 'react';
import './AdminHeader.css';
import logo from '../../../assets/logo.png'
const AdminHeader = () => {
  return (
    <header className="admin-header">

      <div className="admin-logo">
            <a className="admin-logo-link" href="/admin">
              <img className="admin-logo-img" src = {logo} width={50}/>        
              <span>관리자 페이지</span>
            </a>
      </div>

      <nav className="admin-menu">
        <a href="/admin/users">회원 관리</a>
        <a href="/admin/reports">신고 관리</a>
        <a href="/admin/posts">커뮤니티 관리</a>
      </nav>

      <button>로그아웃</button>

    </header>
  );
};

export default AdminHeader;