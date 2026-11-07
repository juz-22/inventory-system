import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { CurrencyProvider } from "../context/CurrencyContext";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <CurrencyProvider>
      <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* ====================================== */}
      {/* Layout */}
      {/* ====================================== */}

      <div className="flex h-full">

        {/* ==================================== */}
        {/* Sidebar */}
        {/* ==================================== */}

        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        {/* ==================================== */}
        {/* Main Area */}
        {/* ==================================== */}

        <div className="flex-1 min-w-0 flex flex-col">

          {/* Navbar */}

          <Navbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          {/* ================================== */}
          {/* Scrollable Content */}
          {/* ================================== */}

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">

            <Outlet />

          </main>

        </div>

      </div>

      </div>
    </CurrencyProvider>
  );
}

export default MainLayout;