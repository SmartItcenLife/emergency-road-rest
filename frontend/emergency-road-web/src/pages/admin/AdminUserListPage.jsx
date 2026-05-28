import { useEffect, useState } from "react";
import AdminLayout from "../../features/admin/components/AdminLayout";
import UserTable from "../../features/admin/components/UserTable";
import ConfirmModal from "../../shared/components/feedback/ConfirmModal";
import "./AdminTable.css";

function AdminUserListPage(){
    const [users, setUsers] = useState([]);
    const [deleteTargetUser, setDeleteTargetUser] = useState(null);

    const handleDeleteUser = (id) => {
    const targetUser = users.find((user) => user.id === id);
    setDeleteTargetUser(targetUser);
  };

    const confirmDeleteUser = async () => {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${deleteTargetUser.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("회원 탈퇴 처리에 실패했습니다.");
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deleteTargetUser.id)
      );

      setDeleteTargetUser(null);
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
          <div className="admin-list-page">
          <UserTable users={users} onDeleteUser={handleDeleteUser}/>
          <ConfirmModal
            open={deleteTargetUser !== null}
            title="회원 탈퇴 처리"
            message={`정말 ${deleteTargetUser?.nickname} 회원을 탈퇴 처리하시겠습니까?`}
            confirmText="탈퇴"
            onConfirm={confirmDeleteUser}
            onCancel={() => setDeleteTargetUser(null)}
          />
          </div>
    </AdminLayout>
  );
}


export default AdminUserListPage;