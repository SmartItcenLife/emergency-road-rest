// Admin 경로 정리
// GET    /admin              대시보드 통계
// GET    /admin/users        회원 목록
// DELETE /admin/users/{id}   회원 삭제

// GET    /admin/posts        게시글 목록
// DELETE /admin/posts/{id}   게시글 삭제

// GET    /admin/reports      신고 목록
// DELETE /admin/reports/{id} 신고 대상 강제 삭제

// 리액트 페이지 라우트도 /admin, 백엔드 API도 /admin이면 충돌날 수 잇음
// 백엔드는 /api/admin으로 바꾸는 게 좋음