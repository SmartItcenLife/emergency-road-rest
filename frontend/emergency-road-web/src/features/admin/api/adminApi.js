import { refreshToken } from "../../auth/api/api";
import { authHeaders } from "../../../shared/utils/authHeaders";

const ADMIN_API_BASE_URL = "/api/admin";

async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      const tokens = await refreshToken();
      localStorage.setItem("accessToken", tokens.accessToken);
      return fetch(url, {
        ...options,
        headers: { Authorization: `Bearer ${tokens.accessToken}`, ...options.headers },
        credentials: "include",
      });
    } catch {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return res;
    }
  }
  return res;
}

export const getDashboardStats = async () => {
  const response = await fetchWithAuth(ADMIN_API_BASE_URL);
  if (!response.ok) throw new Error("대시보드 통계 조회에 실패했습니다.");
  return response.json();
};

export const getDashboardPosts = async () => {
  const response = await fetchWithAuth(`${ADMIN_API_BASE_URL}/posts`);
  if (!response.ok) throw new Error("게시글 목록 조회에 실패했습니다.");
  return response.json();
};

export const getUserList = async () => {
  const response = await fetchWithAuth(`${ADMIN_API_BASE_URL}/users`);
  if (!response.ok) throw new Error("회원 목록 조회에 실패했습니다.");
  return response.json();
};

export const deleteAdminUser = async (id) => {
  const response = await fetchWithAuth(`${ADMIN_API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("회원 탈퇴 처리에 실패했습니다.");
};

export const getPostList = async () => {
  const response = await fetchWithAuth(`${ADMIN_API_BASE_URL}/posts`);
  if (!response.ok) throw new Error("게시글 목록 조회에 실패했습니다.");
  return response.json();
};

export const deleteAdminPost = async (id) => {
  const response = await fetchWithAuth(`${ADMIN_API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("게시글 삭제 처리에 실패했습니다.");
};

export const getReportList = async () => {
  const response = await fetchWithAuth(`${ADMIN_API_BASE_URL}/reports`);
  if (!response.ok) throw new Error("신고글 목록 조회에 실패했습니다.");
  return response.json();
};

export const deleteAdminReport = async (id) => {
  const response = await fetchWithAuth(`${ADMIN_API_BASE_URL}/reports/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("신고 처리에 실패했습니다.");
};
