
function ReportTableRow({ report, index, type, onDeleteReport }) {
  const deleted = report.isTargetDeleted ?? report.targetDeleted;
  const postId = type === "post" ? report.targetId : report.postId; // targetId가 댓글 번호임
  const commentId = type === "comment" ? report.targetId : null;

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{report.reporterNickname}</td>
      <td>
        <a className="post-title" href={
          type === "comment"
          ? `/community/${report.hpid}/posts/${postId}?commentId=${commentId}`
          : `/community/${report.hpid}/posts/${postId}`}>
          {type === "post" ? `게시글 #${report.postId}` : `댓글 #${report.targetId}`}
        </a>
      </td>
      <td>{report.reason}</td>
      <td>{report.createdAt?.replace("T", " ").slice(0, 16)}</td>
      <td>
        <span className={deleted ? "status-deleted" : "status-normal"}>
          {deleted ? "숨김 처리됨" : "정상 게시 중"}
        </span>
      </td>
      <td>
        {!deleted && (
          <button className="delete-button" onClick={() => onDeleteReport(report)}>
            강제삭제
          </button>
        )}
      </td>
    </tr>
  );
}

export default ReportTableRow;