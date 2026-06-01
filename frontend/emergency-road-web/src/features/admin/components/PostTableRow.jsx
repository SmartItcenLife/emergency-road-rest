
function PostTableRow({post, index, onDeletePost}){
    const deleted = post.isDeleted ?? post.deleted;

    return (
        <tr>
            <td>{index+1}</td>
            <td>{post.hospitalName}</td>
            <td>
                <a className="post-title" href={`/community/${post.hpid}/posts/${post.id}`}>
                   {post.title}
                </a>
            </td>
            <td>{post.userName}</td>
            <td>{post.createdAt?.replace("T", " ").slice(0, 16)}</td>            
            <td><span className={deleted ?"status-deleted":"status-normal"}>
                {deleted ? "삭제됨" : "정상"}
                </span>
            </td>
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