import { useNavigate } from "react-router-dom";

import {
  FaBoxesStacked,
  FaTriangleExclamation,
  FaCashRegister,
  FaArrowRight,
  FaChartLine,
  FaHeartPulse,
} from "react-icons/fa6";

import {
  FaDollarSign,
} from "react-icons/fa";
import { useCurrency } from "../../context/CurrencyContext";

function DashboardStats({ dashboardData }) {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();

  const stats = [
    {
      title: "Today's Revenue",
      value: formatCurrency(dashboardData?.todayRevenue ?? 0),
      icon: <FaDollarSign size={28} />,
      color: "bg-green-500/20 text-green-400",
      hover: "hover:border-green-400",
      action: "View Revenue",
      onClick: () => navigate("/sales-history"),
    },

    {
      title: "Products",
      value:
        dashboardData?.totalProducts ?? 0,
      icon: <FaBoxesStacked size={28} />,
      color: "bg-cyan-500/20 text-cyan-400",
      hover: "hover:border-cyan-400",
      action: "Manage Inventory",
      onClick: () => navigate("/products"),
    },

    {
      title: "Inventory Value",
      value: formatCurrency(dashboardData?.inventoryValue ?? 0),
      icon: <FaChartLine size={28} />,
      color: "bg-blue-500/20 text-blue-400",
      hover: "hover:border-blue-400",
      action: "View Inventory",
      onClick: () => navigate("/products"),
    },

    {
      title: "Low Stock",
      value:
        dashboardData?.lowStock ?? 0,
      icon: (
        <FaTriangleExclamation size={28} />
      ),
      color: "bg-red-500/20 text-red-400",
      hover: "hover:border-red-400",
      action: "View Low Stock",
      onClick: () => navigate("/products"),
    },

    {
      title: "Sales Today",
      value:
        dashboardData?.todaySales ?? 0,
      icon: <FaCashRegister size={28} />,
      color:
        "bg-yellow-500/20 text-yellow-400",
      hover:
        "hover:border-yellow-400",
      action: "View Sales",
      onClick: () =>
        navigate("/sales-history"),
    },

    {
      title: "Average Sale",
      value: formatCurrency(dashboardData?.averageSale ?? 0),
      icon: <FaDollarSign size={28} />,
      color: "bg-purple-500/20 text-purple-400",
      hover: "hover:border-purple-400",
      action: "Sales Analytics",
      onClick: () =>
        navigate("/sales-history"),
    },

    {
      title: "Business Health",
      value: `${dashboardData?.businessHealth ?? 100}%`,
      icon: <FaHeartPulse size={28} />,
      color: "bg-emerald-500/20 text-emerald-400",
      hover: "hover:border-emerald-400",
      action: "Business Coach",
      onClick: () =>
        document
          .querySelector("#business-health")
          ?.scrollIntoView({
            behavior: "smooth",
          }),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">

      {stats.map((stat) => (

        <button
          key={stat.title}
          onClick={stat.onClick}
          className={`group bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 shadow-lg text-left hover:scale-105 ${stat.hover}`}
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400 text-sm">
                {stat.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {stat.value}
              </h2>

            </div>

            <div
              className={`p-4 rounded-xl ${stat.color}`}
            >
              {stat.icon}
            </div>

          </div>

          <div className="flex items-center justify-between mt-6 text-sm text-slate-400 group-hover:text-white transition">

            <span>{stat.action}</span>

            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />

          </div>

        </button>

      ))}

    </div>
  );
}

export default DashboardStats;