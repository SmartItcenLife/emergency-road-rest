// table, thead, tbody 담당
// users.map()으로 UserTableRow 반복
import UserTableRow from "./UserTableRow";

function UserTable({users, onDeleteUser}){
    return (
    <table>
      <thead>
        <tr>
          <th>순번</th>
          <th>아이디</th>
          <th>닉네임</th>
          <th>이메일</th>
          <th>권한</th>
          <th>가입일</th>
          <th>관리</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => (
          <UserTableRow
            key={user.id}
            user={user}
            index={index}
            onDeleteUser={onDeleteUser}
          />
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;