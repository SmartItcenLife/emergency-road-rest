import AdminLayout from "../../features/admin/components/AdminLayout";
import { useEffect, useState } from "react";
import DashboardCardGroup from "../../features/admin/components/DashboardCardGroup";
import "./AdminDashboardPage.css";
import RecentPostTable from "../../features/admin/components/RecentPostTable"
import "../../pages/admin/AdminTable.css"

function AdminDashboardPage(){
    const [stats, setStats] = useState({
        todayUsers:0,
        todayPosts:0,
        totalReports:0,
    });
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(()=>{
        const fetchDashboardData = async()=>{
            const statsResponse = await fetch("/api/admin");
            const statsData = await statsResponse.json();
            setStats(statsData);
            
            const postsResponse = await fetch("http://localhost:8080/api/admin/posts");
            const postsData = await postsResponse.json();
            setRecentPosts(postsData.slice(0,5));
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