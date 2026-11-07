import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBox,
  FaDollarSign,
  FaLayerGroup,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { updateProductStock } from "../services/api";
import { useCurrency } from "../context/CurrencyContext";

function DetailRow({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-cyan-400" />}
        <span className="text-slate-400">{label}</span>
      </div>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function ProductDetailsModal({ isOpen, setIsOpen, product, onStockUpdated }) {
  const [currentStock, setCurrentStock] = useState(0);
  const [saving, setSaving] = useState(false);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    if (product) {
      setCurrentStock(Number(product.stock ?? 0));
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const stock = Number(product.stock ?? 0);
  const price = Number(product.price ?? 0);
  const inventoryValue = stock * price;

  let status = "";
  let statusClass = "";
  let statusMessage = "";

  switch (product.stockStatus) {
    case "OPENING_STOCK":
      status = "Opening Stock";
      statusClass = "bg-yellow-500/20 text-yellow-400";
      statusMessage =
        "This inventory is your estimated opening stock. It has not yet been verified by a supplier.";
      break;
    case "WAITING_FOR_RESTOCK":
      status = "Waiting For Restock";
      statusClass = "bg-red-500/20 text-red-400";
      statusMessage =
        "Opening stock has been completely sold. Waiting for the first verified supplier delivery.";
      break;
    case "ACTIVE":
      status = "Verified";
      statusClass = "bg-green-500/20 text-green-400";
      statusMessage =
        "Inventory has been verified through supplier deliveries.";
      break;
    default:
      status = "Unknown";
      statusClass = "bg-slate-500/20 text-slate-400";
      statusMessage = "Status unavailable.";
  }

  const adjustStock = (amount) => {
    setCurrentStock((prev) => Math.max(0, prev + amount));
  };

  const handleSaveStock = async () => {
    try {
      setSaving(true);

      await updateProductStock(product.id, currentStock);

      alert("✅ Stock updated successfully.");

      // Call the callback to refresh the product list
      onStockUpdated?.();

      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update stock.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-[550px] max-w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold mb-8">Product Details</h2>

        <div className="space-y-6">
          <DetailRow
            icon={FaBox}
            label="Product Name"
            value={product.name || "Unnamed Product"}
          />
          <DetailRow
            icon={FaLayerGroup}
            label="Category"
            value={product.category || "Uncategorized"}
          />
          <DetailRow
            icon={FaDollarSign}
            label="Unit Price"
            value={formatCurrency(price)}
          />
          <DetailRow
            icon={FaBox}
            label="Current Stock"
            value={`${currentStock} Units`}
          />
          <DetailRow
            icon={FaDollarSign}
            label="Inventory Value"
            value={formatCurrency(inventoryValue)}
            valueClass="text-emerald-400 font-bold"
          />
          
          {/* Status with Icon and Message */}
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              {product.stockStatus === "ACTIVE" && <FaCheckCircle className="text-green-400" />}
              {product.stockStatus === "OPENING_STOCK" && <FaClock className="text-yellow-400" />}
              {product.stockStatus === "WAITING_FOR_RESTOCK" && <FaExclamationTriangle className="text-red-400" />}
              <span className="text-slate-400">Status</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
              {status}
            </span>
          </div>

          {/* Status Message */}
          <div
            className={`rounded-xl p-4 text-sm ${
              product.stockStatus === "ACTIVE"
                ? "bg-green-500/10 text-green-300 border border-green-500/20"
                : product.stockStatus === "OPENING_STOCK"
                ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                : "bg-red-500/10 text-red-300 border border-red-500/20"
            }`}
          >
            {statusMessage}
          </div>

          <DetailRow
            icon={FaCalendarAlt}
            label="Created"
            value={
              product.createdAt
                ? new Date(product.createdAt).toLocaleDateString([], {
                    dateStyle: "medium",
                  })
                : "N/A"
            }
          />

          {/* Stock Level Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Stock Level</span>
              <span className="font-semibold">{currentStock} Units</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  product.stockStatus === "ACTIVE"
                    ? "bg-green-500"
                    : product.stockStatus === "OPENING_STOCK"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                // 👇 SIMPLIFIED - Removed unnecessary math
                style={{ width: `${Math.min(currentStock, 100)}%` }}
              />
            </div>
          </div>

          {/* Stock Adjustment Controls */}
          <div className="space-y-4">
            {/* 👇 NEW Heading and description */}
            <div>
              <h3 className="text-lg font-semibold text-white">
                Manual Stock Adjustment
              </h3>
              <p className="text-slate-400 text-sm">
                Use this only for inventory corrections, audits, damaged goods, or counting mistakes.
              </p>
            </div>

            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => adjustStock(-10)}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-white"
              >
                -10
              </button>
              <button
                onClick={() => adjustStock(-5)}
                className="px-4 py-2 rounded-lg bg-red-400 hover:bg-red-500 transition text-white"
              >
                -5
              </button>
              <button
                onClick={() => adjustStock(-1)}
                className="px-4 py-2 rounded-lg bg-red-300 hover:bg-red-400 transition text-black"
              >
                -1
              </button>

              <div className="px-6 py-2 rounded-lg bg-slate-800 font-bold text-white">
                {currentStock}
              </div>

              <button
                onClick={() => adjustStock(1)}
                className="px-4 py-2 rounded-lg bg-green-300 hover:bg-green-400 transition text-black"
              >
                +1
              </button>
              <button
                onClick={() => adjustStock(5)}
                className="px-4 py-2 rounded-lg bg-green-400 hover:bg-green-500 transition text-white"
              >
                +5
              </button>
              <button
                onClick={() => adjustStock(10)}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition text-white"
              >
                +10
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition text-white"
              >
                Close
              </button>
              <button
                onClick={handleSaveStock}
                disabled={saving}
                className={`px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving..." : "Save Stock Adjustment"} {/* 👇 UPDATED button text */}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductDetailsModal;
