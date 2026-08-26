import { useEffect, useState } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import DashboardStats from "../components/dashboard/DashboardStats";
import QuickActions from "../components/dashboard/QuickActions";
import CommandCenter from "../components/dashboard/CommandCenter";
import BusinessHealth from "../components/dashboard/BusinessHealth";
import RecentActivity from "../components/dashboard/RecentActivity";
import Notifications from "../components/dashboard/Notifications";
import LowStockWidget from "../components/dashboard/LowStockWidget";
import OfflineStatus from "../components/dashboard/OfflineStatus";
import VoiceAssistant from "../components/dashboard/VoiceAssistant";

import SalesChart from "../components/SalesChart";

function Dashboard() {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/dashboard`
      );

      const data =
        await response.json();

      setDashboardData(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <DashboardHeader />

      <WelcomeBanner />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <BusinessHealth
          dashboardData={dashboardData}
        />

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-2xl font-bold">

            AI Business Coach

          </h2>

          <p className="text-slate-400 mt-4">

            🤖 Good morning! Your business is running smoothly today.

          </p>

          <ul className="mt-5 space-y-3 text-slate-300">

            <li>
              • No critical stock issues detected.
            </li>

            <li>
              • Sales are expected to increase this afternoon.
            </li>

            <li>
              • Mobile Money payments are increasing.
            </li>

            <li>
              • Keep an eye on Cooking Oil stock.
            </li>

          </ul>

        </div>

      </div>

      <DashboardStats
        dashboardData={dashboardData}
      />

      <CommandCenter />

      <QuickActions />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">

          Sales Overview

        </h2>

        <SalesChart />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <RecentActivity
          dashboardData={dashboardData}
        />

        <Notifications
          dashboardData={dashboardData}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <LowStockWidget
          dashboardData={dashboardData}
        />

        <OfflineStatus />

      </div>

      <VoiceAssistant />

    </div>
  );
}

export default Dashboard;