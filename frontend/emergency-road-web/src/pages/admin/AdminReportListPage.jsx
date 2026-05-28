import { useEffect, useState } from "react";
import AdminLayout from "../../features/admin/components/AdminLayout";
import ReportTable from "../../features/admin/components/ReportTable";
import ConfirmModal from "../../shared/components/feedback/ConfirmModal";
import "./AdminTable.css";

function AdminReportListPage(){
    const [reports, setReports] = useState({postReportList: [], commentReportList: []});
    //const [commentReports, setCommentReports] = useState({commentReportList: []})
    const [deleteTargetReport, setDeleteTargetReport] = useState(null);
    //const [deleteTargetComment, setDeleteTargetComment] = useState(null);

    const handleDeleteReport = (report) => {
    setDeleteTargetReport(report);
    };
    
    const confirmDeletePost = async()=>{
    const response = await fetch(`http://localhost:8080/api/admin/reports/${deleteTargetReport.id}`,
        {method:"DELETE",});

    if(!response.ok){
      alert("게시글 삭제 처리에 실패했습니다.");
      return;
    }

    setReports((prevReports) => ({
    postReportList: prevReports.postReportList.map((report) =>
        report.id === deleteTargetReport.id
        ? { ...report, isTargetDeleted: true, targetDeleted: true }
        : report
    ),
    commentReportList: prevReports.commentReportList.map((report) =>
        report.id === deleteTargetReport.id
        ? { ...report, isTargetDeleted: true, targetDeleted: true }
        : report
    ),
    }));

    setDeleteTargetReport(null);

    };

    useEffect(()=>{
        const fetchReports = async()=>{
            const response = await fetch("http://localhost:8080/api/admin/reports");
            const data = await response.json();

            setReports(data);
        };
        fetchReports();
    }, []);

    return (
        <AdminLayout>
            <div className="admin-list-page">
            <ReportTable
            type="post"
            reports={reports.postReportList}
            onDeleteReport={handleDeleteReport}
            />

            <ReportTable
            type="comment"
            reports={reports.commentReportList}
            onDeleteReport={handleDeleteReport}
            />
            
            {/*게시글이랑 댓글 처리 다르게*/}
            <ConfirmModal
            open={deleteTargetReport !== null}
            title={deleteTargetReport?.type === "COMMENT" ? "댓글 삭제 처리" : "게시글 삭제 처리"}
            message={`해당 신고 대상을 삭제 처리하시겠습니까?`}
            confirmText="삭제"
            onConfirm={confirmDeletePost}
            onCancel={() => setDeleteTargetReport(null)}
            />
            </div>
        </AdminLayout>
    );
}

export default AdminReportListPage;