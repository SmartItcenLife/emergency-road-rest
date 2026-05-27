// 회원 한 명의 행 담당
//import UserTable from "./UserTable";
import "../../../pages/admin/AdminDashboardPage.css"

function UserTableRow({user, index, onDeleteUser}){
    return (
        <tr>
            <td>{index+1}</td>
            <td>{user.userName}</td>
            <td>{user.nickname}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.createdAt?.replace("T", " ").slice(0, 16)}</td>
            <td>
                <button className="delete-button" onClick={()=>onDeleteUser(user.id)}>탈퇴</button>
            </td>
        </tr>
    )
}

export default UserTableRow;