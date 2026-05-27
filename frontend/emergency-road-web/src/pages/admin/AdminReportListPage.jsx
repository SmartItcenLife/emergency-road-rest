import "./AdminTable.css";
import AdminLayout from "../../features/admin/components/AdminLayout";
import { useEffect, useState } from "react";
import ReportTable from "../../features/admin/components/ReportTable";

function AdminReportListPage(){
    const [reports, setReports] = useState(
        {
        postReportList: [],
        commentReportList: []
        }
    );

    const handleDeleteReport = async(id)=>{
    const ok = window.confirm("정말 이 게시글을 삭제 처리 하시겠습니까?");
    if(!ok) return;

    const response = await fetch(`http://localhost:8080/api/admin/reports/${id}`,{
      method:"DELETE",
    });

    if(!response.ok){
      alert("게시글 삭제 처리에 실패했습니다.");
      return;
    }

    setReports((prevReports) => ({
    postReportList: prevReports.postReportList.map((report) =>
        report.id === id
        ? { ...report, isTargetDeleted: true, targetDeleted: true }
        : report
    ),
    commentReportList: prevReports.commentReportList.map((report) =>
        report.id === id
        ? { ...report, isTargetDeleted: true, targetDeleted: true }
        : report
    ),
    }));
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
            </div>
        </AdminLayout>
    );
}

export default AdminReportListPage;