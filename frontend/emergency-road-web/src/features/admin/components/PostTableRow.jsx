
function PostTableRow({post, index, onDeletePost}){
    const deleted = post.isDeleted ?? post.deleted;

    return (
        <tr>
            <td>{index+1}</td>
            <td>{post.hospitalName}</td>
            <td>{post.title}</td>
            <td>{post.userName}</td>
            <td>{post.createdAt?.replace("T", " ").slice(0, 16)}</td>            
            <td>{deleted ? "삭제됨" : "정상"}</td>
            <td>
            {!deleted && (
                <button className="delete-button" onClick={() => onDeletePost(post.id)}>
                    삭제
                </button>
                )}
            </td>
        </tr>
    )
}

export default PostTableRow;