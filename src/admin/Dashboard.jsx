import React, { useEffect, useState, useCallback, Suspense, memo } from "react";
import { People, PersonAdd, ShoppingCart } from "@mui/icons-material";
import {
  getRefferalCodes,
  getSubscribedUsers,
  getTopUsers,
  getTotalUsers,
} from "./actions/Dashboard.action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Include the styles

// Lazy load the PieChart component
const MyPieChart = React.lazy(() => import("./components/PieChat"));

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    topUsers: [],
    totalUser: 0,
    subUser: 0,
    referrals: 0,
  });
  const [loading, setLoading] = useState({
    topUsers: true,
    totalUser: true,
    subUser: true,
    referrals: true,
  });

  // Single function to fetch all data
  const fetchDashboardData = useCallback(async () => {
    try {
      const [topUsersRes, totalUserRes, subUserRes, referralsRes] = await Promise.all([
        getTopUsers(),
        getTotalUsers(),
        getSubscribedUsers(),
        getRefferalCodes(),
      ]);

      setDashboardData({
        topUsers: topUsersRes.sort((a, b) => b.tokenUsed - a.tokenUsed),
        totalUser: totalUserRes.length,
        subUser: subUserRes.length,
        referrals: referralsRes.length,
      });

      setLoading({
        topUsers: false,
        totalUser: false,
        subUser: false,
        referrals: false,
      });
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <main className="flex flex-col space-y-5 h-screen w-full justify-between items-center p-10">
      {/* Card section */}
      <section className="flex flex-row w-full space-x-5 justify-center items-center">
        <DashboardCard
          icon={<People />}
          title="Total User"
          count={loading.totalUser ? 0 : dashboardData.totalUser}
        />
        <DashboardCard
          icon={<PersonAdd />}
          title="Subscribed User"
          count={loading.subUser ? 0 : dashboardData.subUser}
        />
        <DashboardCard
          icon={<ShoppingCart />}
          title="Total Referral Codes"
          count={loading.referrals ? 0 : dashboardData.referrals}
        />
        <DashboardCard
          icon={<People />}
          title="Total Visitors"
          count={loading.topUsers ? 0 : 128}
        />
      </section>

      {/* Graph sections */}
      <section className="flex flex-row w-full space-x-10 justify-between items-center">
        {/* Top Users */}
        <div className="bg-white flex-1 rounded-md p-5 flex flex-col text-black h-[65vh]">
          <h2 className="text-lg text-teal-700 font-semibold">Top Users</h2>
          {loading.topUsers ? (
            <div>
              <Skeleton count={10} height={30} />
            </div>
          ) : (
            <TopUsersList topUsers={dashboardData.topUsers} />
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white flex-1 rounded-md p-5 flex flex-col justify-center items-center text-black h-[65vh]">
          <Suspense fallback={<Skeleton width={200} height={200} />}>
            <MyPieChart />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

// Memoize the DashboardCard component to avoid unnecessary re-renders
const DashboardCard = memo(({ icon, title, count }) => (
  <div className="flex-1 bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white h-fit">
    <p>
      {icon} {title}
    </p>
    <p className="text-2xl font-semibold">{count}</p>
  </div>
));

// Memoize the TopUsersList component to avoid unnecessary re-renders
const TopUsersList = memo(({ topUsers }) => (
  <div>
    {topUsers?.map((user) => (
      <div
        key={user.phoneNumber}
        className="flex flex-row justify-between items-center p-2 border-b border-gray-200"
      >
        <p>{user.phoneNumber}</p>
        <p>{user.planName}</p>
      </div>
    ))}
  </div>
));

export default Dashboard;
