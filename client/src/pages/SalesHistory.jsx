import { useEffect, useState, useMemo } from "react";

import {
  FaReceipt,
  FaSearch,
  FaDollarSign,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import {
  getSales,
} from "../services/saleService";
import { useCurrency } from "../context/CurrencyContext";

function SalesHistory() {
  const { formatCurrency } = useCurrency();

  //--------------------------------------------------
  // State
  //--------------------------------------------------

  const [sales, setSales] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [paymentFilter,
    setPaymentFilter] =
    useState("All");

  const [dateFilter,
    setDateFilter] =
    useState("All Time");

  const availableMonths = useMemo(() => {
    const months = new Set(
      sales.map((sale) => {
        const date = new Date(sale.createdAt);
        return `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
      })
    );

    return [...months].sort().reverse();
  }, [sales]);

  const formatMonth = (month) => {
    const [year, monthNumber] = month.split("-");

    return new Date(
      Number(year),
      Number(monthNumber) - 1
    ).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  };

  //--------------------------------------------------
  // Statistics
  //--------------------------------------------------

  const totalRevenue = useMemo(() =>
    sales.reduce(

      (sum, sale) =>

        sum + sale.totalAmount,

      0

    ), [sales]);

  const totalSales = useMemo(() =>
    sales.length, [sales]);

  const averageSale = useMemo(() =>
    totalSales > 0

      ? totalRevenue /
        totalSales

      : 0, [totalSales, totalRevenue]);

  const cashSales = useMemo(() =>
    sales.filter(

      sale =>
        sale.paymentMethod ===
        "Cash"

    ).length, [sales]);

  //--------------------------------------------------
  // Load Sales
  //--------------------------------------------------

  useEffect(() => {

    fetchSales();

  }, []);

  const fetchSales = async () => {

    try {

      const data =
        await getSales();

      setSales(data);

    }

    catch (error) {

      console.error(error);

    }

  };

  //--------------------------------------------------
  // Filter Sales
  //--------------------------------------------------

  const filteredSales = useMemo(() =>
    sales.filter(
    (sale) => {

      const matchesSearch =

        sale.receiptNumber
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        sale.productName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesPayment =

        paymentFilter === "All"

          ? true

          : sale.paymentMethod ===
            paymentFilter;

      let matchesDate = true;

      if (dateFilter === "Today") {

        const today =
          new Date();

        matchesDate =
          new Date(
            sale.createdAt
          ).toDateString() ===
          today.toDateString();

      }

      if (dateFilter.startsWith("Month:")) {
        const selectedMonth = dateFilter.slice(6);
        const saleDate = new Date(sale.createdAt);
        const saleMonth = `${saleDate.getFullYear()}-${String(
          saleDate.getMonth() + 1
        ).padStart(2, "0")}`;

        matchesDate = saleMonth === selectedMonth;
      }

      return (
        matchesSearch &&
        matchesPayment &&
        matchesDate
      );

    }
  ), [sales, search, paymentFilter, dateFilter]);

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (

    <div className="min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">

      {/* =====================================
          Header
      ===================================== */}

      <div className="mb-6 sm:mb-8 min-w-0">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white truncate">

          Sales History

        </h1>

        <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">

          View and manage completed sales.

        </p>

      </div>

      {/* =====================================
          Search & Filters
      ===================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 min-w-0">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

          {/* Search */}

          <div className="relative min-w-0">

            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm sm:text-base"
            />

            <input

              type="text"

              placeholder="Search receipts or products..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 outline-none focus:border-cyan-500 text-sm sm:text-base min-w-0"

            />

          </div>

          {/* Payment */}

          <select

            value={paymentFilter}

            onChange={(e) =>
              setPaymentFilter(
                e.target.value
              )
            }

            className="bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base w-full min-w-0"

          >

            <option>
              All
            </option>

            <option>
              Cash
            </option>

            <option>
              Mobile Money
            </option>

          </select>

          {/* Date */}

          <select

            value={dateFilter}

            onChange={(e) =>
              setDateFilter(
                e.target.value
              )
            }

            className="bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base w-full min-w-0"

          >

            <option>
              All Time
            </option>

            <option>
              Today
            </option>

            {availableMonths.map((month) => (
              <option key={month} value={`Month:${month}`}>
                {formatMonth(month)}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* =====================================
          Statistics
      ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">

        {/* Revenue */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 min-w-0">

          <div className="flex items-center justify-between">

            <div className="min-w-0">

              <p className="text-slate-400 text-xs sm:text-sm">

                Revenue

              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate">

                {formatCurrency(totalRevenue)}

              </h2>

            </div>

            <FaDollarSign
              className="text-green-400 text-xl sm:text-2xl flex-shrink-0 ml-2"
              size={28}
            />

          </div>

        </div>

        {/* Sales */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 min-w-0">

          <div className="flex items-center justify-between">

            <div className="min-w-0">

              <p className="text-slate-400 text-xs sm:text-sm">

                Sales

              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate">

                {totalSales}

              </h2>

            </div>

            <FaShoppingCart
              className="text-cyan-400 text-xl sm:text-2xl flex-shrink-0 ml-2"
              size={28}
            />

          </div>

        </div>

        {/* Average */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 min-w-0">

          <div className="flex items-center justify-between">

            <div className="min-w-0">

              <p className="text-slate-400 text-xs sm:text-sm">

                Average Sale

              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate">

                {formatCurrency(averageSale)}

              </h2>

            </div>

            <FaReceipt
              className="text-yellow-400 text-xl sm:text-2xl flex-shrink-0 ml-2"
              size={28}
            />

          </div>

        </div>

        {/* Cash */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 min-w-0">

          <div className="flex items-center justify-between">

            <div className="min-w-0">

              <p className="text-slate-400 text-xs sm:text-sm">

                Cash Sales

              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate">

                {cashSales}

              </h2>

            </div>

            <FaMoneyBillWave
              className="text-emerald-400 text-xl sm:text-2xl flex-shrink-0 ml-2"
              size={28}
            />

          </div>

        </div>

      </div>

      {/* =====================================
          Sales Table
      ===================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-w-0">

        {filteredSales.length === 0 ? (

          <div className="p-8 sm:p-12 lg:p-20 text-center">

            <div className="flex flex-col items-center">

              <FaReceipt
                size={36}
                className="text-slate-600 mb-3 sm:mb-4"
              />

              <h3 className="text-lg sm:text-xl font-semibold text-white">

                No Sales Found

              </h3>

              <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base">

                Try changing your filters or complete a new sale.

              </p>

            </div>

          </div>

        ) : (

          <>

            {/* Desktop/Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead className="bg-slate-950">

                  <tr className="text-left text-slate-400 text-xs sm:text-sm">

                    <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                      Receipt
                    </th>

                    <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                      Product
                    </th>

                    <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                      Qty
                    </th>

                    <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                      Total
                    </th>

                    <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                      Payment
                    </th>

                    <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredSales.map((sale) => {

                    const paymentClass =
                      sale.paymentMethod === "Cash"

                        ? "bg-green-500/20 text-green-400"

                        : "bg-cyan-500/20 text-cyan-400";

                    return (

                      <tr

                        key={sale.id}

                        className="border-t border-slate-800 hover:bg-slate-800/40 transition-all"

                      >

                        {/* Receipt */}

                        <td className="p-3 sm:p-4 lg:p-5">

                          <Link

                            to={`/receipt/${sale.id}`}

                            className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm sm:text-base"

                          >

                            {sale.receiptNumber}

                          </Link>

                        </td>

                        {/* Product */}

                        <td className="p-3 sm:p-4 lg:p-5">

                          <div className="min-w-0">

                            <h3 className="font-semibold text-white text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px]">

                              {sale.productName}

                            </h3>

                            <p className="text-xs text-slate-500">

                              Sale #{sale.id}

                            </p>

                          </div>

                        </td>

                        {/* Quantity */}

                        <td className="p-3 sm:p-4 lg:p-5 text-sm sm:text-base">

                          {sale.quantity}

                        </td>

                        {/* Total */}

                        <td className="p-3 sm:p-4 lg:p-5 font-semibold text-sm sm:text-base">

                          {formatCurrency(sale.totalAmount)}

                        </td>

                        {/* Payment */}

                        <td className="p-3 sm:p-4 lg:p-5">

                          <span

                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${paymentClass}`}

                          >

                            {sale.paymentMethod}

                          </span>

                        </td>

                        {/* Date */}

                        <td className="p-3 sm:p-4 lg:p-5 text-xs sm:text-sm text-slate-400 whitespace-nowrap">

                          {new Date(
                            sale.createdAt
                          ).toLocaleString()}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">

              {filteredSales.map((sale) => {

                const paymentClass =
                  sale.paymentMethod === "Cash"

                    ? "bg-green-500/20 text-green-400"

                    : "bg-cyan-500/20 text-cyan-400";

                return (

                  <div

                    key={sale.id}

                    className="border-b border-slate-800 last:border-0 p-4 hover:bg-slate-800/30 transition"

                  >

                    <div className="flex flex-col gap-2">

                      <div className="flex items-start justify-between">

                        <div className="min-w-0 flex-1">

                          <Link

                            to={`/receipt/${sale.id}`}

                            className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm"

                          >

                            {sale.receiptNumber}

                          </Link>

                          <p className="text-xs text-slate-500 mt-0.5">

                            Sale #{sale.id}

                          </p>

                        </div>

                        <span

                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${paymentClass}`}

                        >

                          {sale.paymentMethod}

                        </span>

                      </div>

                      <div>

                        <h3 className="font-semibold text-white text-sm truncate">

                          {sale.productName}

                        </h3>

                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">

                        <div className="flex items-center gap-3">

                          <span className="text-xs text-slate-400">

                            Qty: <span className="font-semibold text-white">{sale.quantity}</span>

                          </span>

                          <span className="text-xs text-slate-400">

                            Total: <span className="font-semibold text-green-400">

                              {formatCurrency(sale.totalAmount)}

                            </span>

                          </span>

                        </div>

                        <span className="text-xs text-slate-500">

                          {new Date(
                            sale.createdAt
                          ).toLocaleString()}

                        </span>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </>

        )}

      </div>

      {/* =====================================
          Future Features Placeholder
      ===================================== */}

      {/*
        Future additions:

        ✅ Receipt Preview
        ✅ Print Receipt
        ✅ Download PDF
        ✅ Export Excel
        ✅ Delete Sale
        ✅ Refund Sale
        ✅ Customer Details
        ✅ AI Sales Insights

        Date filters:
        Today / This Week / This Month / All Time

        Payment methods:
        Cash / Mobile Money / Card / Bank Transfer

        Better date display:
        Today, 10:45 AM
        Yesterday, 5:32 PM
      */}

    </div>

  );

}

export default SalesHistory;