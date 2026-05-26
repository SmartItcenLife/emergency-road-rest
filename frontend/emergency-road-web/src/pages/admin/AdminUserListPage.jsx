// 회원 목록 GET /api/admin/users 연결하기
import AdminLayout from "../../features/admin/components/AdminLayout";
import PageHeader from "../../features/admin/components/PageHeader";
import { useEffect, useState } from "react";

function AdminUserListPage(){
    const [users, setUsers] = useState([]);

    useEffect(()=>{
        const fetchUsers = async()=>{
            const response = await fetch("/api/admin/users");
            const data = await response.json();

            setUsers(data);
        };
        fetchUsers();
    }, []);

    return(
        <AdminLayout>
      <PageHeader title="회원 관리" />

      <table>
        <thead>
          <tr>
            <th>순번</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>권한</th>
            <th>가입일</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.nickname}</td>
              <td>{user.role}</td>
              <td>{user.createdAt?.replace("T", " ").slice(0, 16)}</td>
              <td>
                <button>탈퇴</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AdminUserListPage;