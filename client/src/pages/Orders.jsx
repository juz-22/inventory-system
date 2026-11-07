import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingCart,
  FaSyncAlt,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

import { getProducts } from "../services/api";
import { useCurrency } from "../context/CurrencyContext";

function Orders() {
  const { formatCurrency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [orderItems, setOrderItems] = useState([]);

  // ==========================================
  // Load Products
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load ordering inventory:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // Calculate Recommended Order Quantity
  // ==========================================

  const getRecommendedQuantity = (product) => {
    const stock =
      Number(product.stock ?? 0);

    if (stock === 0) {
      return 20;
    }

    if (stock <= 5) {
      return 15;
    }

    if (stock <= 10) {
      return 10;
    }

    return 0;
  };

  // ==========================================
  // Products That Need Ordering
  // ==========================================

  const productsToOrder = useMemo(() => {
    return products.filter((product) => {
      return (
        getRecommendedQuantity(product) > 0
      );
    });
  }, [products]);

  // ==========================================
  // Categories
  // ==========================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        productsToOrder
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [productsToOrder]);

  // ==========================================
  // Filter Products
  // ==========================================

  const filteredProducts = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return productsToOrder.filter(
      (product) => {
        const name =
          product.name?.toLowerCase() || "";

        const productCategory =
          product.category || "";

        const matchesSearch =
          !searchValue ||
          name.includes(searchValue) ||
          productCategory
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =
          category === "All" ||
          productCategory === category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    productsToOrder,
    search,
    category,
  ]);

  // ==========================================
  // Add Product To Order
  // ==========================================

  const addToOrder = (product) => {
    const recommended =
      getRecommendedQuantity(product);

    setOrderItems((currentItems) => {
      const existing =
        currentItems.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        return currentItems.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price ?? 0),
          quantity: recommended || 1,
        },
      ];
    });
  };

  // ==========================================
  // Increase Order Quantity
  // ==========================================

  const increaseQuantity = (id) => {
    setOrderItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // ==========================================
  // Decrease Order Quantity
  // ==========================================

  const decreaseQuantity = (id) => {
    setOrderItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  // ==========================================
  // Remove From Order
  // ==========================================

  const removeFromOrder = (id) => {
    setOrderItems((items) =>
      items.filter(
        (item) => item.id !== id
      )
    );
  };

  // ==========================================
  // Clear Order
  // ==========================================

  const clearOrder = () => {
    if (orderItems.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Clear all products from the order list?"
    );

    if (!confirmed) {
      return;
    }

    setOrderItems([]);
  };

  // ==========================================
  // Order Statistics
  // ==========================================

  const orderStats = useMemo(() => {
    const products =
      orderItems.length;

    const units =
      orderItems.reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

    const estimatedCost =
      orderItems.reduce(
        (total, item) =>
          total +
          item.quantity *
            item.price,
        0
      );

    return {
      products,
      units,
      estimatedCost,
    };
  }, [orderItems]);

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center px-4">
        <div className="text-slate-400 text-base sm:text-lg text-center">
          Loading ordering inventory...
        </div>
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full space-y-6 sm:space-y-8">

      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
            Ordering
          </h1>

          <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Plan your next inventory purchase.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition text-sm sm:text-base w-full sm:w-auto touch-manipulation"
        >
          <FaSyncAlt className="text-sm sm:text-base flex-shrink-0" />
          Refresh Inventory
        </button>

      </div>

      {/* ====================================== */}
      {/* Statistics */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 min-w-0">

          <div className="flex items-center justify-between">

            <div className="min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm">
                Products Needing Order
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-red-400 truncate">
                {productsToOrder.length}
              </h2>
            </div>

            <FaExclamationTriangle className="text-red-400 text-xl sm:text-2xl flex-shrink-0 ml-2" />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 min-w-0">

          <div className="flex items-center justify-between">

            <div className="min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm">
                Products In Order
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-cyan-400 truncate">
                {orderStats.products}
              </h2>
            </div>

            <FaClipboardList className="text-cyan-400 text-xl sm:text-2xl flex-shrink-0 ml-2" />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 min-w-0 sm:col-span-2 lg:col-span-1">

          <div className="flex items-center justify-between">

            <div className="min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm">
                Units To Order
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-green-400 truncate">
                {orderStats.units}
              </h2>
            </div>

            <FaBoxes className="text-green-400 text-xl sm:text-2xl flex-shrink-0 ml-2" />

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* Search + Category */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 min-w-0">

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

          <div className="relative flex-1 min-w-0">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm sm:text-base" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products to order..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-white outline-none focus:border-cyan-500 text-sm sm:text-base min-w-0"
            />

          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white outline-none focus:border-cyan-500 text-sm sm:text-base w-full sm:w-auto min-w-0 sm:min-w-[150px]"
          >

            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* ====================================== */}
      {/* Products Needing Order */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-w-0">

        <div className="p-4 sm:p-6 border-b border-slate-800">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold">
                Products Needing Order
              </h2>

              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                {filteredProducts.length} product(s)
                require attention.
              </p>
            </div>

          </div>

        </div>

        {filteredProducts.length === 0 ? (

          <div className="p-8 sm:p-12 text-center">

            <FaCheckCircle className="mx-auto text-4xl sm:text-5xl text-green-400 mb-3 sm:mb-4" />

            <h3 className="text-base sm:text-lg font-semibold text-slate-300">
              Inventory looks good
            </h3>

            <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base">
              No products currently require ordering.
            </p>

          </div>

        ) : (

          <>
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[700px]">

                <thead>

                  <tr className="text-left text-slate-400 text-xs sm:text-sm border-b border-slate-800">

                    <th className="p-3 sm:p-4 whitespace-nowrap">
                      Product
                    </th>

                    <th className="p-3 sm:p-4 whitespace-nowrap">
                      Category
                    </th>

                    <th className="p-3 sm:p-4 whitespace-nowrap">
                      Current Stock
                    </th>

                    <th className="p-3 sm:p-4 whitespace-nowrap">
                      Priority
                    </th>

                    <th className="p-3 sm:p-4 whitespace-nowrap">
                      Recommended
                    </th>

                    <th className="p-3 sm:p-4 text-right whitespace-nowrap">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.map(
                    (product) => {

                      const stock =
                        Number(
                          product.stock ?? 0
                        );

                      const recommended =
                        getRecommendedQuantity(
                          product
                        );

                      const alreadyAdded =
                        orderItems.some(
                          (item) =>
                            item.id ===
                            product.id
                        );

                      const priority =
                        stock === 0
                          ? "URGENT"
                          : "LOW STOCK";

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition"
                        >

                          <td className="p-3 sm:p-4">

                            <div className="font-semibold text-white text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px]">
                              {product.name}
                            </div>

                          </td>

                          <td className="p-3 sm:p-4 text-slate-400 text-sm sm:text-base">
                            {product.category ||
                              "Uncategorized"}
                          </td>

                          <td className="p-3 sm:p-4">

                            <span
                              className={`font-bold text-sm sm:text-base ${
                                stock === 0
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              }`}
                            >
                              {stock}
                            </span>

                            <span className="text-slate-500 ml-1 text-xs sm:text-sm">
                              units
                            </span>

                          </td>

                          <td className="p-3 sm:p-4">

                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                stock === 0
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {priority}
                            </span>

                          </td>

                          <td className="p-3 sm:p-4">

                            <span className="font-bold text-cyan-400 text-sm sm:text-base">
                              {recommended}
                            </span>

                            <span className="text-slate-500 ml-1 text-xs sm:text-sm">
                              units
                            </span>

                          </td>

                          <td className="p-3 sm:p-4 text-right">

                            <button
                              onClick={() =>
                                addToOrder(
                                  product
                                )
                              }
                              className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold transition text-sm sm:text-base touch-manipulation ${
                                alreadyAdded
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-cyan-500 text-black hover:bg-cyan-400"
                              }`}
                            >

                              {alreadyAdded ? (
                                <>
                                  <FaCheckCircle className="text-sm sm:text-base" />
                                  <span className="hidden sm:inline">Added</span>
                                </>
                              ) : (
                                <>
                                  <FaPlus className="text-sm sm:text-base" />
                                  <span className="hidden sm:inline">Add To Order</span>
                                  <span className="sm:hidden">Add</span>
                                </>
                              )}

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>
            </div>

            {/* Mobile Card View - Visible only on phones/tablets */}
            <div className="md:hidden">
              {filteredProducts.map((product) => {
                const stock = Number(product.stock ?? 0);
                const recommended = getRecommendedQuantity(product);
                const alreadyAdded = orderItems.some(
                  (item) => item.id === product.id
                );
                const priority = stock === 0 ? "URGENT" : "LOW STOCK";

                return (
                  <div
                    key={product.id}
                    className="border-b border-slate-800 last:border-0 p-4 hover:bg-slate-800/30 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white text-sm truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {product.category || "Uncategorized"}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs text-slate-400">
                            Stock: <span className={`font-bold ${stock === 0 ? "text-red-400" : "text-yellow-400"}`}>
                              {stock}
                            </span>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              stock === 0
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {priority}
                          </span>
                          <span className="text-xs text-cyan-400">
                            Recommend: {recommended}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToOrder(product)}
                        className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl font-semibold transition text-sm touch-manipulation ${
                          alreadyAdded
                            ? "bg-green-500/20 text-green-400"
                            : "bg-cyan-500 text-black hover:bg-cyan-400"
                        }`}
                      >
                        {alreadyAdded ? (
                          <>
                            <FaCheckCircle />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <FaPlus />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>

        )}

      </div>

      {/* ====================================== */}
      {/* Current Order */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-w-0">

        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

          <div className="min-w-0">

            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
              <FaShoppingCart className="text-cyan-400 flex-shrink-0" />
              <span className="truncate">Current Order</span>
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Products selected for your next purchase.
            </p>

          </div>

          {orderItems.length > 0 && (
            <button
              onClick={clearOrder}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition text-sm sm:text-base w-full sm:w-auto touch-manipulation"
            >
              <FaTrash className="text-sm sm:text-base" />
              Clear Order
            </button>
          )}

        </div>

        {orderItems.length === 0 ? (

          <div className="p-8 sm:p-12 text-center">

            <FaShoppingCart className="mx-auto text-4xl sm:text-5xl text-slate-600 mb-3 sm:mb-4" />

            <h3 className="text-base sm:text-lg font-semibold text-slate-300">
              Your order is empty
            </h3>

            <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base">
              Add products from the list above.
            </p>

          </div>

        ) : (

          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">

            {orderItems.map(
              (item) => (

                <motion.div
                  key={item.id}
                  layout
                  className="bg-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >

                  <div className="flex-1 min-w-0">

                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {item.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">
                      {item.category}
                    </p>

                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-sm sm:text-base touch-manipulation flex-shrink-0"
                    >
                      <FaMinus />
                    </button>

                    <div className="w-12 sm:w-16 text-center font-bold text-sm sm:text-base">
                      {item.quantity}
                    </div>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 flex items-center justify-center text-sm sm:text-base touch-manipulation flex-shrink-0"
                    >
                      <FaPlus />
                    </button>

                  </div>

                  <div className="text-right min-w-[80px] sm:min-w-[120px]">

                    <p className="text-xs text-slate-500">
                      Est. Cost
                    </p>

                    <p className="font-bold text-green-400 text-sm sm:text-base">
                      {formatCurrency(item.quantity * item.price)}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeFromOrder(
                        item.id
                      )
                    }
                    className="p-2 sm:p-3 rounded-lg text-red-400 hover:bg-red-500/10 touch-manipulation flex-shrink-0"
                    title="Remove"
                  >
                    <FaTrash className="text-sm sm:text-base" />
                  </button>

                </motion.div>

              )
            )}

            {/* Order Summary */}

            <div className="border-t border-slate-700 pt-4 sm:pt-6 mt-4 sm:mt-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

                <div className="bg-slate-800 rounded-xl p-3 sm:p-4 min-w-0">

                  <p className="text-slate-400 text-xs sm:text-sm">
                    Products
                  </p>

                  <p className="text-xl sm:text-2xl font-bold mt-1 truncate">
                    {orderStats.products}
                  </p>

                </div>

                <div className="bg-slate-800 rounded-xl p-3 sm:p-4 min-w-0">

                  <p className="text-slate-400 text-xs sm:text-sm">
                    Total Units
                  </p>

                  <p className="text-xl sm:text-2xl font-bold mt-1 text-cyan-400 truncate">
                    {orderStats.units}
                  </p>

                </div>

                <div className="bg-slate-800 rounded-xl p-3 sm:p-4 min-w-0 sm:col-span-2 lg:col-span-1">

                  <p className="text-slate-400 text-xs sm:text-sm">
                    Estimated Cost
                  </p>

                  <p className="text-xl sm:text-2xl font-bold mt-1 text-green-400 truncate">
                    {formatCurrency(orderStats.estimatedCost)}
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Orders;