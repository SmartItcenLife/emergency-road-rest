// fetch를 직접 쓰지 말고 API 파일을 하나 만들기

const ADMIN_API_BASE_URL = "http://localhost:8080/api/admin";

function authHeaders(){
  const token = localStorage.getItem("accessToken");

  return token
  ? {Authorization: `Bearer ${token}`}
  : {};
}

export const getDashboardStats = async() => {
  const response = await fetch(ADMIN_API_BASE_URL, {
    headers: authHeaders(),
  });

  if(!response.ok){
    throw new Error("대시보드 통계 조회에 실패했습니다.");
  }

  return response.json();
};

export const getDashboardPosts = async() =>{
  const response = await fetch(`${ADMIN_API_BASE_URL}/posts`,{
    headers: authHeaders(),
  });

  if(!response.ok){
    throw new Error("게시글 목록 조회에 실패했습니다.");
  }

  return response.json();
};

export const getUserList = async() => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/users`, {
    headers: authHeaders(),
  });

  if(!response.ok){
    throw new Error("회원 목록 조회에 실패했습니다.");
  }

  return response.json();
};

export const deleteAdminUser = async(id) => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if(!response.ok){
    throw new Error("회원 탈퇴 처리에 실패했습니다.");
  }

};

export const getPostList = async() => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/posts`, {
    headers: authHeaders(),
  });

  if(!response.ok){
    throw new Error("게시글 목록 조회에 실패했습니다.");
  }

  return response.json();
}

export const deleteAdminPost = async(id) => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if(!response.ok){
    throw new Error("게시글 삭제 처리에 실패했습니다.");
  }

};

export const getReportList = async() => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/reports`, {
    headers: authHeaders(),
  });

  if(!response.ok){
    throw new Error("신고글 목록 조회에 실패했습니다.");
  }

  return response.json();
}

export const deleteAdminReport = async(id) => {
  const response = await fetch(`${ADMIN_API_BASE_URL}/reports/${id}`, {
    method:"DELETE",
    headers: authHeaders(),
  });

  if(!response.ok){
    throw new Error("신고 처리에 실패했습니다.");
  }
}