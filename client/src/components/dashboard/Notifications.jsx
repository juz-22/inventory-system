import { useNavigate } from "react-router-dom";

import {
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleInfo,
  FaBell,
  FaChevronRight,
} from "react-icons/fa6";

function Notifications({
  dashboardData,
}) {
  const navigate = useNavigate();

  const notifications = [];

  if (dashboardData?.todaySales > 0) {
    notifications.push({
      id: "sales",
      type: "success",
      title: "Sales Today",
      message: `${dashboardData.todaySales} sale(s) completed today.`,
      time: "Today",
      page: "/sales-history",
    });
  }

  if (dashboardData?.lowStock > 0) {
    notifications.push({
      id: "low-stock",
      type: "warning",
      title: "Low Stock Alert",
      message: `${dashboardData.lowStock} product(s) need restocking.`,
      time: "Today",
      page: "/products",
    });
  }

  if (dashboardData?.totalProducts > 0) {
    notifications.push({
      id: "inventory",
      type: "info",
      title: "Inventory Loaded",
      message: `${dashboardData.totalProducts} product(s) currently in inventory.`,
      time: "Now",
      page: "/products",
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      id: "system",
      type: "info",
      title: "System Ready",
      message:
        "InventorySys is running normally.",
      time: "Now",
      page: "/",
    });
  }

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <FaCircleCheck className="text-green-400" />
        );

      case "warning":
        return (
          <FaTriangleExclamation className="text-yellow-400" />
        );

      default:
        return (
          <FaCircleInfo className="text-cyan-400" />
        );
    }
  };

  return (
    <div
      id="notifications"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"
    >

      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">

          <FaBell
            className="text-cyan-400"
            size={22}
          />

          <div>

            <h2 className="text-2xl font-bold">
              Notifications
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Recent system alerts
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            navigate("/activity")
          }
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
        >

          View All

          <FaChevronRight />

        </button>

      </div>

      <div className="space-y-4">

        {notifications.map(
          (notification) => (

            <button
              key={notification.id}
              onClick={() =>
                navigate(notification.page)
              }
              className="group w-full flex items-start gap-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-xl p-4 transition-all duration-300 text-left"
            >

              <div className="text-xl mt-1">

                {getIcon(
                  notification.type
                )}

              </div>

              <div className="flex-1">

                <h3 className="font-semibold group-hover:text-cyan-400 transition">

                  {notification.title}

                </h3>

                <p className="text-slate-400 text-sm mt-1">

                  {notification.message}

                </p>

                <p className="text-xs text-cyan-400 mt-3 opacity-0 group-hover:opacity-100 transition">

                  Open →

                </p>

              </div>

              <span className="text-xs text-slate-500">

                {notification.time}

              </span>

            </button>

          )
        )}

      </div>

    </div>
  );
}

export default Notifications;