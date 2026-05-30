import React from 'react';
import './Header.css';
import logo from '../../../assets/logo.png';
import AdminHeader from '../../../pages/admin/AdminHeader';
const Header = ({ type }) =>{
    // 1. 각 타입별 메뉴를 객체로 정의
    // 관리자면 아예 다른 헤더 반환
  if(type === "admin"){
    return <AdminHeader />;
  }
  const menuConfig = {
    home: (
      <div className="home-menu">
        {/* <a href="/">홈</a> */}
      </div>
    ),
    recommend: (
      <div className="recommend-menu">
        <a href="/map">응급실 찾기</a>
        <a href="/guide">이용 가이드</a>
      </div>
    ),
    community: (
      <div className="community-menu">
        <a href="/free">자유게시판</a>
        <a href="/qna">질문게시판</a>
      </div>
    )
};

return (
    <header className={`header ${type}`}>
      <div className="header-inner">
        <div className="logo-area">
        <img src={logo} alt="응급길 로고" className="logo-img" />
        {/* <span className="logo-text">응급길</span> */}
      </div>
     {/* 2. 정의된 객체에서 type에 맞는 메뉴를 가져옴 (없을 시 null) */}
      <nav className="nav-menu">
        {menuConfig[type] || null}
      </nav>
      </div>
    </header>
  );

}
export default Header;