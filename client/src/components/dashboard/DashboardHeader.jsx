import { useEffect, useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaWifi,
} from "react-icons/fa";
import {
  clearSalesHistory,
  getSales,
  authenticateAdmin,
  changeAdminPassword,
} from "../../services/saleService";

function DashboardHeader() {
  const [currentTime, setCurrentTime] =
    useState(new Date());

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);
  const [profileOpen, setProfileOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [salesYears, setSalesYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [profileError, setProfileError] = useState("");
  const [clearing, setClearing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Online/Offline status
  useEffect(() => {
    const goOnline = () =>
      setIsOnline(true);

    const goOffline = () =>
      setIsOnline(false);

    window.addEventListener(
      "online",
      goOnline
    );

    window.addEventListener(
      "offline",
      goOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        goOnline
      );

      window.removeEventListener(
        "offline",
        goOffline
      );
    };
  }, []);

  // Time-based greeting
  const hour = currentTime.getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  // Formatted date
  const formattedDate = currentTime.toLocaleDateString(
    undefined,
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const handleProfileOpen = () => {
    setProfileOpen(true);
    setPassword("");
    setAuthenticated(false);
    setChangePasswordOpen(false);
    setProfileError("");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setProfileError("");

    try {
      await authenticateAdmin(password);
      const sales = await getSales();
      const years = [...new Set(
        sales.map((sale) => new Date(sale.createdAt).getFullYear())
      )].sort((a, b) => b - a);

      setSalesYears(years);
      setSelectedYear(years[0]?.toString() || "");
      setAuthenticated(true);
    } catch (error) {
      setProfileError(error.message);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setProfileError("");

    if (newPassword !== confirmPassword) {
      setProfileError("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);
      await changeAdminPassword(password, newPassword);
      setPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setProfileError("Administrator password changed successfully.");
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleClearSales = async () => {
    if (!selectedYear) return;
    if (!window.confirm(`Clear all sales from ${selectedYear}? This cannot be undone.`)) {
      return;
    }

    try {
      setClearing(true);
      const result = await clearSalesHistory(password, selectedYear);
      setProfileError(result.message);
      setSalesYears((years) =>
        years.filter((year) => year.toString() !== selectedYear)
      );
      setSelectedYear("");
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

      {/* Left Side */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Business Command Center
        </h1>

        <p className="text-slate-400 mt-2">
          {greeting}! Welcome back to InventorySys.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Date & Time */}
        <div className="text-right">
          <p className="text-sm text-slate-400">
            {formattedDate}
          </p>

          <h2 className="text-xl font-bold">
            {currentTime.toLocaleTimeString()}
          </h2>
        </div>

        {/* Online Status */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          isOnline
            ? "bg-green-500/20 border-green-500"
            : "bg-red-500/20 border-red-500"
        }`}>

          <FaWifi className={
            isOnline
              ? "text-green-400"
              : "text-red-400"
          } />

          <span className={
            isOnline
              ? "text-green-300"
              : "text-red-300"
          }>

            {isOnline
              ? "Online"
              : "Offline"}

          </span>

        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() =>
            document
              .querySelector("#notifications")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          aria-label="View notifications"
          className="relative bg-slate-900 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition"
        >

          <FaBell size={20} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>

        </button>

        {/* User */}
        <button
          type="button"
          onClick={handleProfileOpen}
          className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl hover:bg-slate-800 transition text-left"
        >

          <FaUserCircle
            size={35}
            className="text-cyan-400"
          />

          <div>

            <p className="font-semibold">
              Admin
            </p>

            <span className="text-sm text-slate-400">
              System Owner
            </span>

          </div>

          </button>

          {profileOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-profile-title"
            >
              <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 id="admin-profile-title" className="text-2xl font-bold">
                      Admin Profile
                    </h2>
                    {authenticated && (
                      <p className="text-cyan-400 mt-1">Wah Ajavon</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                    className="text-slate-400 hover:text-white text-xl"
                    aria-label="Close admin profile"
                  >
                    ×
                  </button>
                </div>

                {!authenticated ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <label className="block text-sm text-slate-300" htmlFor="admin-password">
                      Administrator password
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                      autoFocus
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl"
                    >
                      Unlock Admin Controls
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <label className="block text-sm text-slate-300" htmlFor="sales-year">
                      Clear sales history for year
                    </label>
                    <select
                      id="sales-year"
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(event.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                    >
                      <option value="">Select a year</option>
                      {salesYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleClearSales}
                      disabled={!selectedYear || clearing}
                      className="w-full bg-red-500/80 hover:bg-red-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl"
                    >
                      {clearing ? "Clearing..." : "Clear Sales History"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setChangePasswordOpen((open) => !open)}
                      className="w-full border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white font-semibold py-3 rounded-xl transition"
                    >
                      {changePasswordOpen
                        ? "Cancel Password Change"
                        : "Change Password"}
                    </button>

                    {changePasswordOpen && (
                      <form
                        onSubmit={handleChangePassword}
                        className="border-t border-slate-700 pt-4 space-y-3"
                      >
                        <p className="text-sm font-semibold text-slate-300">
                          Change administrator password
                        </p>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                          placeholder="New password (8+ characters)"
                          minLength={8}
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          placeholder="Confirm new password"
                          minLength={8}
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
                        />
                        <button
                          type="submit"
                          disabled={changingPassword}
                          className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl"
                        >
                          {changingPassword ? "Changing..." : "Save New Password"}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {profileError && (
                  <p className="mt-4 text-sm text-yellow-300">{profileError}</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
  );
}

export default DashboardHeader;