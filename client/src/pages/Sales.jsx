import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaMicrophone,
  FaShoppingCart,
  FaCashRegister,
  FaMoneyBillWave,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import {
  getProducts,
  createSale,
} from "../services/api";
import { useCurrency } from "../context/CurrencyContext";

function Sales() {

  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();

  //--------------------------------------------------
  // State
  //--------------------------------------------------

  const [products, setProducts] =
    useState([]);

  const [cart,
    setCart] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [saleData,
    setSaleData] =
    useState({

      productName: "",

      quantity: 1,

      paymentMethod: "Cash",

    });

  //--------------------------------------------------
  // Derived Values
  //--------------------------------------------------

  const filteredProducts = useMemo(() =>
    products.filter((product) =>

      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      product.category
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    ), [products, search]);

  const subtotal = useMemo(() =>
    cart.reduce(

      (total, item) =>

        total +
        item.price *
          item.quantity,

      0

    ), [cart]);

  const tax = 0;

  const total =
    subtotal + tax;

  //--------------------------------------------------
  // Load Products
  //--------------------------------------------------

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts = async () => {

    try {

      const data =
        await getProducts();

      setProducts(data);

    }

    catch (error) {

      console.error(error);

    }

  };

  //--------------------------------------------------
  // Shopping Cart
  //--------------------------------------------------

  const addToCart = (product) => {

    if (product.stock === 0) {

      alert("Product is out of stock.");

      return;

    }

    const existingItem =
      cart.find(
        (item) =>
          item.id === product.id
      );

    if (existingItem) {

      setCart(
        cart.map((item) =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item

        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);

    }

  };

  const increaseQuantity = (id) => {

    setCart(
      cart.map((item) =>

        item.id === id

          ? {
              ...item,
              quantity:
                Math.min(
                  item.quantity + 1,
                  item.stock
                ),
            }

          : item

      )
    );

  };

  const decreaseQuantity = (id) => {

    setCart(

      cart
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

  const removeFromCart = (id) => {

    setCart(

      cart.filter(
        (item) =>
          item.id !== id
      )

    );

  };

  //--------------------------------------------------
  // Product Selection
  //--------------------------------------------------

  const handleProductChange = (product) => {

    addToCart(product);

    setSaleData({

      ...saleData,

      productName:
        product.name,

    });

  };

  //--------------------------------------------------
  // Quantity
  //--------------------------------------------------

  const handleQuantityChange = (e) => {

    setSaleData({

      ...saleData,

      quantity: Number(
        e.target.value
      ),

    });

  };

  //--------------------------------------------------
  // Payment
  //--------------------------------------------------

  const handlePaymentChange = (e) => {

    setSaleData({

      ...saleData,

      paymentMethod:
        e.target.value,

    });

  };

  //--------------------------------------------------
  // Voice
  //--------------------------------------------------

  const startVoiceInput = () => {

    const SpeechRecognition =

      window.SpeechRecognition ||

      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Voice recognition is not supported."
      );

      return;

    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult =
      (event) => {

        const transcript =
          event.results[0][0].transcript;

        setSearch(transcript);

      };

  };

  //--------------------------------------------------
  // Complete Sale
  //--------------------------------------------------

  const handleSale = async () => {

    if (cart.length === 0) {

      alert(
        "Your cart is empty."
      );

      return;

    }

    try {

      setLoading(true);

      const response = await createSale({
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: saleData.paymentMethod,
      });

      alert(
        `${cart.length} product(s) sold successfully.`
      );

      setCart([]);

      setSaleData({

        productName: "",

        quantity: 1,

        paymentMethod: "Cash",

      });

      setSearch("");

      await fetchProducts();

      if (response.receiptNumber) {

        navigate(
          `/receipt/${response.receiptNumber}`
        );

      }

      //-----------------------------------------
      // Future Hooks
      //-----------------------------------------

      // Refresh Dashboard
      // Refresh Activity
      // Generate Receipt
      // Print Receipt
      // AI Sales Analysis

    }

    catch (error) {

      console.error(error);

      alert(
        "Unable to complete sale."
      );

    }

    finally {

      setLoading(false);

    }

  };

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (

    <div className="min-w-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">

      {/* ======================================
          Header
      ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">

        <div className="min-w-0">

          <h1 className="text-3xl sm:text-4xl font-bold text-white truncate">

            Sales Terminal

          </h1>

          <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">

            Create and process customer sales.

          </p>

        </div>

        <button

          onClick={startVoiceInput}

          className="bg-cyan-500 hover:bg-cyan-400 transition text-black px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto touch-manipulation"

        >

          <FaMicrophone size={16} className="sm:text-base" />

          Voice Input

        </button>

      </div>

      {/* ======================================
          Search
      ====================================== */}

      <div className="relative mb-6 sm:mb-8 min-w-0">

        <FaSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          size={16}
        />

        <input

          type="text"

          placeholder="Search products..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 sm:py-4 pl-11 pr-4 outline-none focus:border-cyan-500 text-sm sm:text-base min-w-0"

        />

      </div>

      {/* ======================================
          Layout
      ====================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

        {/* ======================================
            Products List
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 min-w-0">

          <div className="flex items-center gap-3 mb-4 sm:mb-6">

            <FaShoppingCart
              className="text-cyan-400 text-lg sm:text-xl flex-shrink-0"
            />

            <h2 className="text-xl sm:text-2xl font-bold">
              Products
            </h2>

            <span className="ml-auto text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              {filteredProducts.length}
            </span>

          </div>

          <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[480px] lg:max-h-[520px] overflow-y-auto pr-1">

            {filteredProducts.length === 0 ? (

              <div className="text-center py-10 sm:py-16 text-slate-500 text-sm sm:text-base">

                No matching products found.

              </div>

            ) : (

              filteredProducts.map((product) => (

                <button

                  key={product.id}

                  onClick={() =>
                    handleProductChange(product)
                  }

                  disabled={product.stock === 0}

                  className={`w-full text-left border rounded-xl p-3 sm:p-4 transition-all touch-manipulation ${
                    product.stock === 0
                      ? "opacity-40 cursor-not-allowed border-slate-700"
                      : "border-slate-700 hover:border-cyan-500 hover:bg-slate-800 active:bg-slate-800"
                  }`}

                >

                  <div className="flex items-center justify-between gap-2">

                    <div className="min-w-0 flex-1">

                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">

                        {product.name}

                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 truncate">

                        {product.category}

                      </p>

                    </div>

                    <div className="text-right flex-shrink-0">

                      <p className="font-bold text-sm sm:text-base">

                        $
                        {Number(
                          product.price
                        ).toFixed(2)}

                      </p>

                      <p className="text-xs text-slate-500">

                        Stock:
                        {" "}
                        {product.stock}

                      </p>

                      <p
                        className={`text-xs mt-0.5 sm:mt-1 ${
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 10
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >

                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 10
                          ? "Low Stock"
                          : "In Stock"}

                      </p>

                    </div>

                  </div>

                </button>

              ))

            )}

          </div>

        </div>

        {/* ======================================
            Sale Summary
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 min-w-0 flex flex-col">

          <div className="flex items-center gap-3 mb-4 sm:mb-6">

            <FaCashRegister
              className="text-green-400 text-lg sm:text-xl flex-shrink-0"
            />

            <h2 className="text-xl sm:text-2xl font-bold">

              Order Summary

            </h2>

            {cart.length > 0 && (
              <span className="ml-auto text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                {cart.length} items
              </span>
            )}

          </div>

          {/* ======================================
              Shopping Cart
          ====================================== */}

          {cart.length === 0 ? (

            <div className="text-center py-12 sm:py-16 lg:py-20 text-slate-500 text-sm sm:text-base flex-1 flex flex-col items-center justify-center">

              <FaShoppingCart className="text-4xl sm:text-5xl text-slate-700 mb-4" />

              Cart is empty.

              <br />

              Select products from the left.

            </div>

          ) : (

            <>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1 overflow-y-auto max-h-[300px] sm:max-h-[350px] lg:max-h-[400px] pr-1">

                {cart.map((item) => (

                  <div

                    key={item.id}

                    className="bg-slate-800 rounded-xl p-3 sm:p-4"

                  >

                    <div className="flex items-center justify-between gap-2">

                      <div className="min-w-0 flex-1">

                        <h3 className="font-bold text-sm sm:text-base truncate">

                          {item.name}

                        </h3>

                        <p className="text-xs sm:text-sm text-slate-400">

                          {formatCurrency(item.price)}

                        </p>

                      </div>

                      <button

                        onClick={() =>
                          removeFromCart(item.id)
                        }

                        className="text-red-400 hover:text-red-300 transition p-1.5 sm:p-2 touch-manipulation flex-shrink-0"

                      >

                        <FaTrash size={14} className="sm:text-base" />

                      </button>

                    </div>

                    <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2">

                      <div className="flex items-center gap-2 sm:gap-3">

                        <button

                          onClick={() =>
                            decreaseQuantity(item.id)
                          }

                          className="bg-slate-700 w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-slate-600 transition text-sm sm:text-base touch-manipulation flex items-center justify-center"

                        >

                          -

                        </button>

                        <span className="font-bold text-sm sm:text-base min-w-[20px] text-center">

                          {item.quantity}

                        </span>

                        <button

                          onClick={() =>
                            increaseQuantity(item.id)
                          }

                          className="bg-cyan-500 text-black w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-cyan-400 transition text-sm sm:text-base touch-manipulation flex items-center justify-center"

                        >

                          +

                        </button>

                      </div>

                      <div className="font-bold text-cyan-400 text-sm sm:text-base flex-shrink-0">

                        {formatCurrency(item.price * item.quantity)}

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* Payment */}

              <div className="mb-4 sm:mb-6">

                <label className="block mb-2 font-semibold text-sm sm:text-base">

                  Payment Method

                </label>

                <select

                  value={
                    saleData.paymentMethod
                  }

                  onChange={
                    handlePaymentChange
                  }

                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 sm:p-3 text-sm sm:text-base min-w-0"

                >

                  <option>
                    Cash
                  </option>

                  <option>
                    Mobile Money
                  </option>

                  <option>
                    Card
                  </option>

                </select>

              </div>

              {/* ======================================
                  Order Totals
              ====================================== */}

              <div className="bg-slate-800 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6">

                <div className="flex justify-between mb-2 sm:mb-3 text-sm sm:text-base">

                  <span className="text-slate-400">
                    Subtotal
                  </span>

                  <span>
                    {formatCurrency(subtotal)}
                  </span>

                </div>

                <div className="flex justify-between mb-2 sm:mb-3 text-sm sm:text-base">

                  <span className="text-slate-400">
                    Tax
                  </span>

                  <span>
                    {formatCurrency(tax)}
                  </span>

                </div>

                <hr className="border-slate-700 my-2 sm:my-3" />

                <div className="flex justify-between text-lg sm:text-xl font-bold">

                  <span>Total</span>

                  <span className="text-cyan-400">

                    {formatCurrency(total)}

                  </span>

                </div>

              </div>

              {/* ======================================
                  Complete Sale
              ====================================== */}

              <button

                onClick={handleSale}

                disabled={loading}

                className={`w-full py-3 sm:py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base touch-manipulation ${
                  loading
                    ? "bg-slate-700 cursor-not-allowed text-slate-400"
                    : "bg-cyan-500 hover:bg-cyan-400 text-black"
                }`}

              >

                <FaMoneyBillWave size={16} className="sm:text-base flex-shrink-0" />

                {loading
                  ? "Processing Sale..."
                  : `Complete Sale (${formatCurrency(total)})`}

              </button>

            </>

          )}

        </div>

      </div>

    </div>

  );

}

export default Sales;