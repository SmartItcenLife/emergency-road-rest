import StatCard from "./StatCard";

function DashboardCardGroup({ stats }) {
  return (
    <div className="dashboard-cards">
      <StatCard title="오늘 가입 회원" number={stats.todayUsers} />
      <StatCard title="오늘 새 게시글" number={stats.todayPosts} />
      <StatCard title="신고 접수 건" number={stats.totalReports} danger />
    </div>
  );
}

export default DashboardCardGroup;