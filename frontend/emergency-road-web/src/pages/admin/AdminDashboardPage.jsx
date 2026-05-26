// 1. stats 상태 만들기
// 2. 페이지 처음 열릴 때 /api/admin 호출
// 3. 응답 데이터를 stats에 저장
// 4. DashboardCardGroup에 stats 넘기기
import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
//import DashboardCardGroup from "../../components/admin/DashboardCardGroup";
import { useEffect, useState } from "react";

function AdminDashboardPage(){
    const [stats, setStats] = useState({
        todayUsers:0,
        todayPosts:0,
        totalReports:0,
    });

    useEffect(()=>{
        const fetchStats = async()=>{
            const response = await fetch("/api/admin");
            const data = await response.json();

            setStats(data);
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout>
            <PageHeader
            title="대시보드"
            description="응급길 시스템 관리자 현황을 한눈에 확인하세요"
            />
            
            <div className="dashboard-cards">
                <div className="card">
                    <h3>오늘 가입한 회원</h3>
                    <p className="number">{stats.todayUsers}</p>
                </div>

                <div className="card">
                    <h3>오늘 새 게시글</h3>
                    <p className="number">{stats.todayPosts}</p>
                </div>

                <div className="card">
                    <h3>신고 접수 건</h3>
                    <p className="number danger">{stats.totalReports}</p>
                </div>
            </div>
            </AdminLayout>
    )
}

export default AdminDashboardPage;