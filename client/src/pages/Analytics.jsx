import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHeartPulse,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaMoneyBillTrendUp,
  FaCartShopping,
  FaBoxesStacked,
  FaTriangleExclamation,
  FaCircleExclamation,
  FaChartLine,
  FaTrophy,
  FaRotate,
} from "react-icons/fa6";

import { getAnalytics } from "../services/api/analyticsApi";
import { useCurrency } from "../context/CurrencyContext";

function Analytics() {
  const { formatCurrency } = useCurrency();
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // Load Analytics
  // ==========================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAnalytics();

      setAnalytics(data);

    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );

      setError(
        error?.message ||
          "Failed to load business analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ==========================================
  // Helpers
  // ==========================================

  const formatMoney = (value) => {
    return formatCurrency(value);
  };

  const formatNumber = (value) => {
    return Number(
      value || 0
    ).toLocaleString();
  };

  // ==========================================
  // Derived Data
  // ==========================================

  const overview =
    analytics?.overview || {};

  const inventory =
    analytics?.inventory || {};

  const bestSellingProducts =
    analytics?.bestSellingProducts || [];

  const revenueByCategory =
    analytics?.revenueByCategory || [];

  const dailyRevenue =
    analytics?.dailyRevenue || [];

  const businessHealth =
    Number(
      analytics?.businessHealth ?? 0
    );

  const isHealthy =
    businessHealth >= 80;

  const totalCategoryRevenue =
    useMemo(() => {
      return revenueByCategory.reduce(
        (total, item) =>
          total +
          Number(item.revenue || 0),
        0
      );
    }, [revenueByCategory]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">

        <div className="text-center">

          <FaChartLine className="text-cyan-400 text-4xl mx-auto mb-4 animate-pulse" />

          <p className="text-slate-400">
            Loading Business Health...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Business Health
          </h1>

          <p className="text-slate-400 mt-2">
            Business performance and analytics.
          </p>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <FaTriangleExclamation className="text-red-400 text-xl" />

            <div>

              <h2 className="font-semibold text-red-400">
                Unable to load analytics
              </h2>

              <p className="text-slate-400 mt-1">
                {error}
              </p>

            </div>

          </div>

          <button
            onClick={fetchAnalytics}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition"
          >
            <FaRotate />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Business Health
          </h1>

          <p className="text-slate-400 mt-2">
            Understand how your business is performing.
          </p>

        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
        >
          <FaRotate />
          Refresh Report
        </button>

      </div>

      {/* ====================================== */}
      {/* Business Health Score */}
      {/* ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
      >

        <div className="flex flex-col lg:flex-row items-center gap-8">

          {/* Score */}

          <div className="flex-shrink-0">

            <div
              className={`w-44 h-44 rounded-full border-8 flex items-center justify-center ${
                isHealthy
                  ? "border-green-500"
                  : "border-yellow-500"
              }`}
            >

              <div className="text-center">

                <FaHeartPulse
                  className={`mx-auto mb-2 text-2xl ${
                    isHealthy
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                />

                <h2
                  className={`text-5xl font-bold ${
                    isHealthy
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {businessHealth}%
                </h2>

                <p className="text-slate-400 mt-1">
                  {isHealthy
                    ? "Healthy"
                    : "Needs Attention"}
                </p>

              </div>

            </div>

          </div>

          {/* Explanation */}

          <div className="flex-1 w-full">

            <div className="flex items-center gap-3 mb-3">

              {isHealthy ? (
                <FaArrowTrendUp className="text-green-400" />
              ) : (
                <FaArrowTrendDown className="text-yellow-400" />
              )}

              <h2 className="text-2xl font-bold">
                Overall Business Health
              </h2>

            </div>

            <p className="text-slate-400 mb-6">
              Your score combines current sales activity
              and inventory health to give you a quick
              overview of the business.
            </p>

            <div>

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-400">
                  Health Score
                </span>

                <span className="font-semibold">
                  {businessHealth}%
                </span>

              </div>

              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                <div
                  style={{
                    width: `${businessHealth}%`,
                  }}
                  className={`h-full transition-all duration-700 ${
                    isHealthy
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />

              </div>

            </div>

          </div>

        </div>

      </motion.div>

      {/* ====================================== */}
      {/* Revenue Cards */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-slate-400 text-sm">
                Today's Revenue
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-400">
                {formatMoney(
                  overview.todayRevenue
                )}
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                {formatNumber(
                  overview.todaySales
                )} sales
              </p>

            </div>

            <FaMoneyBillTrendUp className="text-green-400 text-2xl" />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-slate-400 text-sm">
                Last 7 Days
              </p>

              <h2 className="text-3xl font-bold mt-2 text-cyan-400">
                {formatMoney(
                  overview.weekRevenue
                )}
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                {formatNumber(
                  overview.weekSales
                )} sales
              </p>

            </div>

            <FaChartLine className="text-cyan-400 text-2xl" />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-slate-400 text-sm">
                This Month
              </p>

              <h2 className="text-3xl font-bold mt-2 text-purple-400">
                {formatMoney(
                  overview.monthRevenue
                )}
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                {formatNumber(
                  overview.monthSales
                )} sales
              </p>

            </div>

            <FaMoneyBillTrendUp className="text-purple-400 text-2xl" />

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* Sales Performance */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <p className="text-slate-400 text-sm">
            Units Sold Today
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {formatNumber(
              overview.todayUnits
            )}
          </h2>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <p className="text-slate-400 text-sm">
            Units Sold This Month
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {formatNumber(
              overview.monthUnits
            )}
          </h2>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <p className="text-slate-400 text-sm">
            Average Transaction
          </p>

          <h2 className="text-3xl font-bold mt-2 text-yellow-400">
            {formatMoney(
              overview.averageTransaction
            )}
          </h2>

        </div>

      </div>

      {/* ====================================== */}
      {/* 7 Day Revenue Trend */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-6">

          <FaChartLine className="text-cyan-400 text-xl" />

          <div>

            <h2 className="text-xl font-bold">
              Revenue Trend
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Daily performance over the last 7 days.
            </p>

          </div>

        </div>

        <div className="space-y-4">

          {dailyRevenue.length === 0 ? (

            <p className="text-slate-500">
              No sales data available.
            </p>

          ) : (

            dailyRevenue.map(
              (day) => {

                const maxRevenue =
                  Math.max(
                    ...dailyRevenue.map(
                      (item) =>
                        Number(
                          item.revenue || 0
                        )
                    ),
                    1
                  );

                const width =
                  Number(
                    day.revenue || 0
                  ) /
                  maxRevenue *
                  100;

                return (
                  <div
                    key={day.date}
                    className="flex items-center gap-4"
                  >

                    <div className="w-24 text-xs text-slate-400">
                      {new Date(
                        `${day.date}T00:00:00`
                      ).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>

                    <div className="flex-1">

                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                        <div
                          style={{
                            width: `${width}%`,
                          }}
                          className="h-full bg-cyan-500 rounded-full transition-all"
                        />

                      </div>

                    </div>

                    <div className="w-28 text-right">

                      <p className="font-semibold">
                        {formatMoney(
                          day.revenue
                        )}
                      </p>

                      <p className="text-xs text-slate-500">
                        {day.sales} sales
                      </p>

                    </div>

                  </div>
                );
              }
            )

          )}

        </div>

      </div>

      {/* ====================================== */}
      {/* Best Selling Products + Inventory */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Best Sellers */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <div className="flex items-center gap-3">

              <FaTrophy className="text-yellow-400 text-xl" />

              <div>

                <h2 className="text-xl font-bold">
                  Best Selling Products
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Top products by units sold this month.
                </p>

              </div>

            </div>

          </div>

          <div className="p-6">

            {bestSellingProducts.length === 0 ? (

              <p className="text-slate-500">
                No sales data available yet.
              </p>

            ) : (

              <div className="space-y-4">

                {bestSellingProducts.map(
                  (product, index) => (

                    <div
                      key={product.productName}
                      className="flex items-center gap-4"
                    >

                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400">
                        {index + 1}
                      </div>

                      <div className="flex-1">

                        <p className="font-semibold">
                          {product.productName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {formatNumber(
                            product.unitsSold
                          )} units sold
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-green-400">
                          {formatMoney(
                            product.revenue
                          )}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

        {/* Inventory Health */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <div className="flex items-center gap-3">

              <FaBoxesStacked className="text-cyan-400 text-xl" />

              <div>

                <h2 className="text-xl font-bold">
                  Inventory Health
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Current inventory condition.
                </p>

              </div>

            </div>

          </div>

          <div className="p-6 space-y-4">

            <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <FaBoxesStacked className="text-cyan-400" />

                <span className="text-slate-300">
                  Total Products
                </span>

              </div>

              <span className="font-bold">
                {formatNumber(
                  inventory.totalProducts
                )}
              </span>

            </div>

            <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <FaMoneyBillTrendUp className="text-green-400" />

                <span className="text-slate-300">
                  Inventory Value
                </span>

              </div>

              <span className="font-bold text-green-400">
                {formatMoney(
                  inventory.inventoryValue
                )}
              </span>

            </div>

            <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <FaTriangleExclamation className="text-yellow-400" />

                <span className="text-yellow-200">
                  Low Stock
                </span>

              </div>

              <span className="font-bold text-yellow-400">
                {formatNumber(
                  inventory.lowStock
                )}
              </span>

            </div>

            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <FaCircleExclamation className="text-red-400" />

                <span className="text-red-200">
                  Out of Stock
                </span>

              </div>

              <span className="font-bold text-red-400">
                {formatNumber(
                  inventory.outOfStock
                )}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* Revenue By Category */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <div className="p-6 border-b border-slate-800">

          <h2 className="text-xl font-bold">
            Revenue By Category
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Category performance for the current month.
          </p>

        </div>

        <div className="p-6">

          {revenueByCategory.length === 0 ? (

            <p className="text-slate-500">
              No category sales data available yet.
            </p>

          ) : (

            <div className="space-y-5">

              {revenueByCategory.map(
                (item) => {

                  const percentage =
                    totalCategoryRevenue > 0
                      ? (
                          Number(
                            item.revenue || 0
                          ) /
                          totalCategoryRevenue
                        ) *
                        100
                      : 0;

                  return (
                    <div
                      key={item.category}
                    >

                      <div className="flex justify-between mb-2">

                        <div>

                          <span className="font-semibold">
                            {item.category}
                          </span>

                          <span className="text-xs text-slate-500 ml-2">
                            {formatNumber(
                              item.unitsSold
                            )} units
                          </span>

                        </div>

                        <span className="font-semibold text-green-400">
                          {formatMoney(
                            item.revenue
                          )}
                        </span>

                      </div>

                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                        <div
                          style={{
                            width: `${percentage}%`,
                          }}
                          className="h-full bg-cyan-500 rounded-full"
                        />

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Analytics;