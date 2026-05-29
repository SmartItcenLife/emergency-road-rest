import { useEffect, useState } from "react";
import AdminLayout from "../../features/admin/components/AdminLayout";
import ReportTable from "../../features/admin/components/ReportTable";
import ConfirmModal from "../../shared/components/feedback/ConfirmModal";
import "./AdminTable.css";
import "./AdminReportListPage.css"
import Pagination from "../../shared/components/ui/Pagination";
import { getReportList, deleteAdminReport } from "../../features/admin/api/adminApi";

function AdminReportListPage(){
    const [reports, setReports] = useState({postReportList: [], commentReportList: []});
    const [deleteTargetReport, setDeleteTargetReport] = useState(null);
    const [activeReportType, setActiveReportType] = useState("post");

    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const activeReports =
    activeReportType === "post"
        ? reports.postReportList
        : reports.commentReportList;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pagedReports = activeReports.slice(startIndex, startIndex + PAGE_SIZE);

    const handleDeleteReport = (report) => {
    setDeleteTargetReport(report);
    };

    useEffect(()=>{
        const fetchReports = async()=>{
            try{
                const response = await getReportList();
                setReports(response);
            }
            catch(error){
                console.error(error);
                alert(error.message);
            }
        };
        fetchReports();
    }, []);
    
    const confirmDeletePost = async()=>{
        try{
            const response = await deleteAdminReport(deleteTargetReport.id);
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
        }
        catch(error){
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <AdminLayout>
            <div className="admin-list-page">
            <div className="report-toggle">
                <button
                    type="button"
                    className={activeReportType === "post" ? "active" : ""}
                    onClick={()=>{setActiveReportType("post"); setCurrentPage(1);}}
                >게시글</button>

                <button
                    type="button"
                    className={activeReportType === "comment" ? "active" : ""}
                    onClick={()=>{setActiveReportType("comment"); setCurrentPage(1);}}
                >댓글</button>
            </div>
                <ConfirmModal
                open={deleteTargetReport !== null}
                title={deleteTargetReport?.targetType === "COMMENT" ? "댓글 삭제 처리" : "게시글 삭제 처리"}
                message={`해당 신고 대상을 삭제 처리하시겠습니까?`}
                confirmText="삭제"
                onConfirm={confirmDeletePost}
                onCancel={() => setDeleteTargetReport(null)}
                />
                <ReportTable
                type={activeReportType}
                reports={pagedReports}
                onDeleteReport={handleDeleteReport}
                />

                <Pagination
                currentPage={currentPage}
                totalItems={activeReports.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                />
            </div>
        </AdminLayout>
    );
}

export default AdminReportListPage;