import PostTableRow from "./PostTableRow";

function PostTable({posts, onDeletePost}){
    return(
        <table className="post-table">
            <thead>
                <tr>
                <th>글 번호</th>
                <th>병원 이름</th>
                <th>글 제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>상태</th>
                <th>관리</th>
                </tr>
            </thead>

            <tbody>
                {posts.map((post, index)=>(
                    <PostTableRow
                    key={post.id}
                    post={post}
                    index={index}
                    onDeletePost={onDeletePost}
                    />
                ))}
            </tbody>
        </table>
    )
}

export default PostTable;