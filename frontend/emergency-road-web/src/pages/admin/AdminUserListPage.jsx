import { useEffect, useState } from "react";
import AdminLayout from "../../features/admin/components/AdminLayout";
import UserTable from "../../features/admin/components/UserTable";
import ConfirmModal from "../../shared/components/feedback/ConfirmModal";
import "./AdminTable.css";
import Pagination from "../../shared/components/ui/Pagination";
import { deleteAdminUser, getUserList } from "../../features/admin/api/adminApi";

function AdminUserListPage(){
    const [users, setUsers] = useState([]);
    const [deleteTargetUser, setDeleteTargetUser] = useState(null);
    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pagedUsers = users.slice(startIndex, startIndex + PAGE_SIZE);

    const handleDeleteUser = (id) => {
    const targetUser = users.find((user) => user.id === id);
    setDeleteTargetUser(targetUser);
  };

    const confirmDeleteUser = async () => {
      try{
          const response = await deleteAdminUser(deleteTargetUser.id);

          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== deleteTargetUser.id)
          );

          setDeleteTargetUser(null);
      }catch(error){
          console.error(error);
          alert(error.message);
      }
      
    };

    useEffect(()=>{
        const fetchUsers = async()=>{
            const response = await getUserList();
            setUsers(response);
        };
        fetchUsers();
    }, []);

    return(
        <AdminLayout>
          <div className="admin-list-page">
          <UserTable users={pagedUsers} onDeleteUser={handleDeleteUser}/>
          <ConfirmModal
            open={deleteTargetUser !== null}
            title="회원 탈퇴 처리"
            message={`정말 ${deleteTargetUser?.nickname} 회원을 탈퇴 처리하시겠습니까?`}
            confirmText="탈퇴"
            onConfirm={confirmDeleteUser}
            onCancel={() => setDeleteTargetUser(null)}
          />
          <Pagination
          currentPage={currentPage}
          totalItems={users.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
          </div>
    </AdminLayout>
  );
}


export default AdminUserListPage;