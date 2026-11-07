import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrency } from "../context/CurrencyContext";

function Receipt() {
  const { receiptNumber } = useParams();

  const [sale, setSale] = useState(null);

  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    fetchReceipt();
  }, [receiptNumber]);

  const fetchReceipt = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sales/receipt/${receiptNumber}`
      );

      const data = await response.json();

      setSale(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading receipt...
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="text-center py-20">
        Receipt not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          InventorySys Receipt
        </h1>

        <div className="space-y-4">

          <p>
            <strong>Receipt Number:</strong>{" "}
            {sale.receiptNumber}
          </p>

          <p>
            <strong>Product:</strong>{" "}
            {sale.productName}
          </p>

          <p>
            <strong>Quantity:</strong>{" "}
            {sale.quantity}
          </p>

          <p>
            <strong>Unit Price:</strong>{" "}
            {formatCurrency(sale.unitPrice)}
          </p>

          <p>
            <strong>Total:</strong>{" "}
            {formatCurrency(sale.totalAmount)}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {sale.paymentMethod}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              sale.createdAt
            ).toLocaleString()}
          </p>

        </div>

        <button
          onClick={() => window.print()}
          className="mt-8 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl"
        >
          🖨 Print Receipt
        </button>

      </div>
    </div>
  );
}

export default Receipt;