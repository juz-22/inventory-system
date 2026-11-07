import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCurrency } from "../context/CurrencyContext";

function SalesChart({
  dashboardData,
}) {
  const { formatCurrency } = useCurrency();
  const data =
    dashboardData?.salesChart || [];

  // Empty state
  if (data.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          Revenue Trend
        </h2>

        <div className="h-[300px] flex items-center justify-center text-slate-500">
          No sales data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Revenue Trend
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                formatCurrency(value),
                "Revenue",
              ]}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{
                r: 5,
              }}
              activeDot={{
                r: 8,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesChart;