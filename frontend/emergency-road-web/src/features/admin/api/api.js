// fetch를 직접 쓰지 말고 API 파일을 하나 만들기

const BASE_URL = "/api/admin";

export const getDashboardStats = () =>
  fetch(BASE_URL).then((res) => res.json());

export const getAdminUsers = () =>
  fetch(`${BASE_URL}/users`).then((res) => res.json());

export const deleteAdminUser = (id) =>
  fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });

export const getAdminPosts = () =>
  fetch(`${BASE_URL}/posts`).then((res) => res.json());

export const deleteAdminPost = (id) =>
  fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" });

export const getAdminReports = () =>
  fetch(`${BASE_URL}/reports`).then((res) => res.json());

export const deleteReportedTarget = (reportId) =>
  fetch(`${BASE_URL}/reports/${reportId}`, { method: "DELETE" });
<script>
    
</script>