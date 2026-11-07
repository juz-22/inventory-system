import { useEffect, useRef, useState } from "react";
import {
  FaFileCsv,
  FaCloudUploadAlt,
  FaTrash,
  FaSyncAlt,
  FaDatabase,
  FaSearch,
} from "react-icons/fa";
import { importProducts, getProducts } from "../services/api";
import { useCurrency } from "../context/CurrencyContext";

function ImportProducts() {
  const { formatCurrency } = useCurrency();
  // ==========================================
  // Refs
  // ==========================================
  const fileInputRef = useRef(null);

  // ==========================================
  // State
  // ==========================================
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // ==========================================
  // Load Products
  // ==========================================
  const loadProducts = async () => {
    try {
      setRefreshing(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setRefreshing(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================
  useEffect(() => {
    loadProducts();
  }, []);

  // ==========================================
  // Filtered Products
  // ==========================================
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  });

  // ==========================================
  // Validate CSV File
  // ==========================================
  const validateFile = (file) => {
    if (!file) return false;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setMessage("Only CSV files are supported.");
      return false;
    }
    setMessage("");
    return true;
  };

  // ==========================================
  // Handle File Selection
  // ==========================================
  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;
    setSelectedFile(file);
  };

  // ==========================================
  // Browse Files
  // ==========================================
  const handleBrowse = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFileSelect(file);
  };

  // ==========================================
  // Drag Events
  // ==========================================
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    handleFileSelect(file);
  };

  // ==========================================
  // Remove Selected File
  // ==========================================
  const removeFile = () => {
    setSelectedFile(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // Import Products
  // ==========================================
  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await importProducts(formData);
      setMessage(response.message || "Products imported successfully.");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh Product List
      await loadProducts();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to import products.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaDatabase className="text-cyan-400 text-2xl" />
          <h1 className="text-2xl font-bold text-white">Import Products</h1>
        </div>
        <button
          onClick={loadProducts}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg text-white transition"
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ==========================================
            Left Column - Import Section
        ========================================== */}
        <div className="space-y-6">
          {/* ==========================================
              Upload Area
          ========================================== */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition ${
              dragActive
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleBrowse}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-cyan-500/10 rounded-full">
                <FaCloudUploadAlt className="text-cyan-400 text-4xl" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  Drag & drop your CSV file
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
                <FaFileCsv className="text-cyan-400" size={14} />
                <span className="text-slate-400 text-xs">CSV only</span>
              </div>
            </div>
          </div>

          {/* ==========================================
              Selected File
          ========================================== */}
          {selectedFile && (
            <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedFile.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ==========================================
              Status Message
          ========================================== */}
          {message && (
            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-slate-300">{message}</p>
            </div>
          )}

          {/* ==========================================
              Import Button
          ========================================== */}
          <button
            onClick={handleImport}
            disabled={!selectedFile || loading}
            className="mt-6 w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Importing Products..." : "Import Products"}
          </button>
        </div>

        {/* ==========================================
            Right Column - Product List
        ========================================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {/* Search Bar */}
          <div className="relative mb-5">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Products in Database</h2>
            <span className="text-sm text-slate-400">
              {filteredProducts.length} Products
            </span>
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-900">
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 text-slate-400">Product</th>
                  <th className="text-left py-3 text-slate-400">Category</th>
                  <th className="text-center py-3 text-slate-400">Stock</th>
                  <th className="text-right py-3 text-slate-400">Price</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 text-white font-medium">
                        {product.name}
                      </td>
                      <td className="py-3 text-slate-300">
                        {product.category}
                      </td>
                      <td className="py-3 text-center text-slate-300">
                        {product.stock}
                      </td>
                      <td className="py-3 text-right text-cyan-400 font-semibold">
                        {formatCurrency(product.price)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportProducts;