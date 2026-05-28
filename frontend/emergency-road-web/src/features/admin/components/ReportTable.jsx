import ReportTableRow from "./ReportTableRow";

function ReportTable({reports, onDeleteReport, type}){
    return(
        <div className="report-section">
        <h2>{type === "post" ? "신고된 게시글 목록" : "신고된 댓글 목록"}</h2>

        <table className="admin-table">
        <thead>
        <tr>
            <th>신고번호</th>
            <th>신고자</th>
            <th>{type === "post" ? "대상 게시글" : "대상 댓글"}</th>
            <th>신고사유</th>
            <th>신고일시</th>
            <th>상태</th>
            <th>관리</th>
        </tr>
        </thead>
        <tbody>
            
            {reports.map((report, index)=>(
                <ReportTableRow
                key={report.id}
                report={report}
                index={index}
                type={type}
                onDeleteReport={onDeleteReport}
                />
            ))}
        </tbody>
        </table>
        </div>
    )
}

export default ReportTable;