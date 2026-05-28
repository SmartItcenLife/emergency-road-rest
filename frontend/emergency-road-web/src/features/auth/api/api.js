/**
 * Auth API — /api/auth/*
 * JWT는 localStorage의 accessToken/refreshToken 사용
 */

const BASE = "/api/auth";

function getToken() {
  return localStorage.getItem("accessToken");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** POST /api/auth/signup  (multipart/form-data) */
export async function signup({
  userName,
  password,
  nickname,
  email,
  profileImage,
}) {
  const form = new FormData();
  form.append("userName", userName);
  form.append("password", password);
  form.append("nickname", nickname);
  form.append("email", email);
  if (profileImage) form.append("profileImage", profileImage);

  const res = await fetch(`${BASE}/signup`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "회원가입에 실패했어요.");
  return data;
}

/** POST /api/auth/login */
export async function login({ userName, password }) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "아이디 또는 비밀번호를 확인해 주세요.");
  return data.data; // { accessToken, refreshToken }
}

/** POST /api/auth/logout */
export async function logout(refreshToken) {
  await fetch(`${BASE}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ refreshToken }),
  });
}

/** POST /api/auth/refresh */
export async function refreshToken(token) {
  const res = await fetch(`${BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: token }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("토큰 재발급에 실패했어요.");
  return data.data;
}

/** GET /api/auth/me */
export async function getMe() {
  const res = await fetch(`${BASE}/me`, {
    headers: { ...authHeaders() },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "내 정보를 불러오는데 실패했어요.");

  const user = data.data;
  if (user?.profileImageUrl?.startsWith("/")) {
    user.profileImageUrl = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}${user.profileImageUrl}`;
  }
  return user;
}

/** PUT /api/auth/me  (multipart/form-data) */
export async function updateMe({ nickname, profileImage }) {
  const form = new FormData();
  if (nickname) form.append("nickname", nickname);
  if (profileImage) form.append("profileImage", profileImage);

  const res = await fetch(`${BASE}/me`, {
    method: "PUT",
    headers: { ...authHeaders() },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "회원정보 수정에 실패했어요.");
  return data;
}
