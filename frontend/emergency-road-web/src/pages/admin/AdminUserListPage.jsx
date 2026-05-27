// 회원 목록 GET /api/admin/users 연결하기
import AdminLayout from "../../features/admin/components/AdminLayout";
import { useEffect, useState } from "react";
import UserTable from "../../features/admin/components/UserTable";
import "./AdminUserListPage.css";

function AdminUserListPage(){
    const [users, setUsers] = useState([]);

    const handleDeleteUser = async(id)=>{
    const ok = window.confirm("정말 이 회원을 탈퇴 처리 하시겠습니까?");
    if(!ok) return;

    const response = await fetch(`http://localhost:8080/api/admin/users/${id}`,{
      method:"DELETE",
    });

    if(!response.ok){
      alert("회원 탈퇴 처리에 실패했습니다.");
      return;
    }

    setUsers((prevUsers)=>prevUsers.filter((user)=>user.id !== id));
  };

    useEffect(()=>{
        const fetchUsers = async()=>{
            const response = await fetch("http://localhost:8080/api/admin/users");
            const data = await response.json();

            setUsers(data);
        };
        fetchUsers();
    }, []);

    return(
        <AdminLayout>
          <UserTable users={users} onDeleteUser={handleDeleteUser}/>
    </AdminLayout>
  );
}

export default AdminUserListPage;