import { useEffect, useState } from "react";

import axios from "axios";

import {
  FaHistory,
  FaClipboardList,
  FaClock,
  FaBoxOpen,
} from "react-icons/fa";

function Activity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/activity`
      );

      setLogs(response.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load activity history.");
    } finally {
      setLoading(false);
    }
  };

  // Get icon for action type
  const getActionIcon = (action) => {
    const actionLower = action?.toLowerCase() || "";

    if (actionLower.includes("added") || actionLower.includes("create")) {
      return "text-green-400";
    }

    if (actionLower.includes("deleted") || actionLower.includes("remove")) {
      return "text-red-400";
    }

    if (actionLower.includes("updated") || actionLower.includes("edit")) {
      return "text-cyan-400";
    }

    if (actionLower.includes("received") || actionLower.includes("stock")) {
      return "text-yellow-400";
    }

    if (actionLower.includes("sale") || actionLower.includes("sold")) {
      return "text-purple-400";
    }

    return "text-slate-400";
  };

  // Get badge color for action type
  const getActionBadge = (action) => {
    const actionLower = action?.toLowerCase() || "";

    if (actionLower.includes("added") || actionLower.includes("create")) {
      return "bg-green-500/20 text-green-400";
    }

    if (actionLower.includes("deleted") || actionLower.includes("remove")) {
      return "bg-red-500/20 text-red-400";
    }

    if (actionLower.includes("updated") || actionLower.includes("edit")) {
      return "bg-cyan-500/20 text-cyan-400";
    }

    if (actionLower.includes("received") || actionLower.includes("stock")) {
      return "bg-yellow-500/20 text-yellow-400";
    }

    if (actionLower.includes("sale") || actionLower.includes("sold")) {
      return "bg-purple-500/20 text-purple-400";
    }

    return "bg-slate-500/20 text-slate-400";
  };

  return (
    <div className="min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">

      {/* =====================================
          Header
      ===================================== */}

      <div className="mb-6 sm:mb-8 min-w-0">
        <div className="flex items-center gap-3">
          <FaHistory className="text-cyan-400 text-2xl sm:text-3xl flex-shrink-0" />

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white truncate">
              Activity History
            </h1>

            <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Track inventory actions
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          Loading State
      ===================================== */}

      {loading && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
          <div className="flex flex-col items-center">
            <FaClock className="text-cyan-400 text-4xl sm:text-5xl animate-pulse mb-4" />

            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Loading activity...
            </h3>

            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Please wait while we fetch the activity logs.
            </p>
          </div>
        </div>
      )}

      {/* =====================================
          Error State
      ===================================== */}

      {!loading && error && (
        <div className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-8 sm:p-12 text-center">
          <div className="flex flex-col items-center">

            <FaBoxOpen className="text-red-400 text-4xl sm:text-5xl mb-4" />

            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Failed to Load Activity
            </h3>

            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              {error}
            </p>

            <button
              onClick={fetchLogs}
              className="mt-4 px-6 py-2 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 transition touch-manipulation"
            >
              Retry
            </button>

          </div>
        </div>
      )}

      {/* =====================================
          Activity Table/Cards
      ===================================== */}

      {!loading && !error && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden min-w-0">

          {logs.length === 0 ? (

            <div className="p-8 sm:p-12 lg:p-20 text-center">
              <div className="flex flex-col items-center">

                <FaClipboardList className="text-slate-600 text-4xl sm:text-5xl mb-3 sm:mb-4" />

                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  No Activity Logs
                </h3>

                <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base">
                  No inventory actions have been recorded yet.
                </p>

              </div>
            </div>

          ) : (

            <>
              {/* Desktop/Tablet Table View */}

              <div className="hidden md:block overflow-x-auto">

                <table className="w-full min-w-[600px]">

                  <thead className="bg-slate-950">
                    <tr className="text-left text-slate-400 text-xs sm:text-sm">

                      <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                        Action
                      </th>

                      <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                        Product
                      </th>

                      <th className="p-3 sm:p-4 lg:p-5 whitespace-nowrap">
                        Timestamp
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-t border-slate-800 hover:bg-slate-800/40 transition-all"
                      >

                        <td className="p-3 sm:p-4 lg:p-5">
                          <span
                            className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getActionBadge(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>

                        <td className="p-3 sm:p-4 lg:p-5 text-sm sm:text-base font-semibold text-white truncate max-w-[150px] sm:max-w-[200px]">
                          {log.productName}
                        </td>

                        <td className="p-3 sm:p-4 lg:p-5 text-xs sm:text-sm text-slate-400 whitespace-nowrap">
                          {new Date(
                            log.createdAt
                          ).toLocaleString()}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

              {/* Mobile Card View */}

              <div className="md:hidden">

                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="border-b border-slate-800 last:border-0 p-4 hover:bg-slate-800/30 transition"
                  >

                    <div className="flex flex-col gap-2">

                      <div className="flex items-start justify-between">

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getActionBadge(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>

                        <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                          {new Date(
                            log.createdAt
                          ).toLocaleString()}
                        </span>

                      </div>

                      <div className="flex items-center gap-2 mt-1">

                        <FaBoxOpen className="text-slate-500 text-sm flex-shrink-0" />

                        <h3 className="font-semibold text-white text-sm truncate">
                          {log.productName}
                        </h3>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            </>

          )}

        </div>
      )}

    </div>
  );
}

export default Activity;