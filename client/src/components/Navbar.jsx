import {
  FaBars,
} from "react-icons/fa6";
import { useCurrency } from "../context/CurrencyContext";

function Navbar({
  onMenuClick,
}) {
  const { currency, currencies, changeCurrency } = useCurrency();

  return (
    <header className="h-16 flex-shrink-0 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">

      {/* ====================================== */}
      {/* Left */}
      {/* ====================================== */}

      <div className="flex items-center gap-3 min-w-0">

        {/* Mobile Menu */}

        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex-shrink-0 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
          aria-label="Open menu"
        >
          <FaBars />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold truncate">
          Dashboard
        </h2>

      </div>

      {/* ====================================== */}
      {/* Right */}
      {/* ====================================== */}

      <div className="flex items-center gap-3 sm:gap-4">

        <label className="sr-only" htmlFor="currency-select">
          Display currency
        </label>
        <select
          id="currency-select"
          value={currency}
          onChange={(event) => changeCurrency(event.target.value)}
          className="bg-slate-800 border border-slate-700 px-2 py-2 rounded-lg outline-none focus:border-cyan-500 text-sm"
          title={`Currency: ${currencies[currency].label}`}
        >
          {Object.entries(currencies).map(([code, details]) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>

        {/* Search */}

        <input
          type="text"
          placeholder="Search..."
          className="
            hidden
            sm:block
            w-32
            md:w-48
            lg:w-64
            bg-slate-800
            border
            border-slate-700
            px-3
            sm:px-4
            py-2
            rounded-lg
            outline-none
            focus:border-cyan-500
            text-sm
          "
        />

        {/* Profile */}

        <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-cyan-500" />

      </div>

    </header>
  );
}

export default Navbar;