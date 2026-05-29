import AdminLayout from "../../features/admin/components/AdminLayout";
import { useEffect, useState } from "react";
import DashboardCardGroup from "../../features/admin/components/DashboardCardGroup";
import "./AdminDashboardPage.css";
import RecentPostTable from "../../features/admin/components/RecentPostTable"
import "../../pages/admin/AdminTable.css"
import {getDashboardStats, getDashboardPosts} from "../../features/admin/api/adminApi";

function AdminDashboardPage(){
    const [stats, setStats] = useState({
        todayUsers:0,
        todayPosts:0,
        totalReports:0,
    });
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(()=>{
        const fetchDashboardData = async()=>{
            try{
                const statsResponse = await getDashboardStats();
                setStats(statsResponse);
                
                const postsResponse = await getDashboardPosts();
                setRecentPosts(postsResponse.slice(0,5));
            }catch(error){
                console.error(error);
                alert("대시보드 데이터를 불러오지 못했습니다.");
            }
        };
        fetchDashboardData();
        
    }, []);

    return (
    <AdminLayout>
    <div className="admin-dashboard-page">
      <DashboardCardGroup stats={stats} />
      <RecentPostTable posts={recentPosts} />
    </div>
  </AdminLayout>
);
}

export default AdminDashboardPage;