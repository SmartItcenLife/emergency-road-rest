// 1. stats 상태 만들기
// 2. 페이지 처음 열릴 때 /api/admin 호출
// 3. 응답 데이터를 stats에 저장
// 4. DashboardCardGroup에 stats 넘기기
import AdminLayout from "../../features/admin/components/AdminLayout";
//import AdminHeader from "../../features/admin/components/AdminHeader";
import { useEffect, useState } from "react";
import DashboardCardGroup from "../../features/admin/components/DashboardCardGroup";
import "./AdminDashboardPage.css";

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
    <div className="admin-dashboard-page">
      <DashboardCardGroup stats={stats} />
    </div>
  </AdminLayout>
);
}

export default AdminDashboardPage;