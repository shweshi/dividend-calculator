import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DividendChartProps, DividendData } from "./types/types";
import { useState } from "react";
import { ChartColumnIncreasing, ChartLine } from "lucide-react";
import { formatNumber } from "../utils";

const DividendChart: React.FC<DividendChartProps> = ({ data }) => {
  const [view, setView] = useState<"monthly" | "quarterly" | "yearly">(
    "monthly"
  );
  const [chartType, setChartType] = useState<"line" | "bar">("line"); // 🔥 New State

  const processData = (
    data: DividendData[],
    type: "monthly" | "quarterly" | "yearly"
  ) => {
    const groupedData: Record<string, Record<string, number>> = {};

    data.forEach((row) => {
      const date = new Date(row.date);
      let key: string;

      if (type === "monthly") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else if (type === "quarterly") {
        key = `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;
      } else {
        key = `${date.getFullYear()}`;
      }

      if (!groupedData[key]) groupedData[key] = {};

      if (!groupedData[key][row.symbol]) {
        groupedData[key][row.symbol] = 0;
      }

      groupedData[key][row.symbol] += row.netDividendAmount || 0;
    });

    return Object.keys(groupedData).map((key) => ({
      key,
      ...Object.keys(groupedData[key]).reduce(
        (acc, stock) => ({
          ...acc,
          [stock]: parseFloat(groupedData[key][stock].toFixed(2)),
        }),
        {}
      ),
    }));
  };

  const chartData = processData(data, view);

  const stockNames = Array.from(new Set(data.map((row) => row.symbol)));

  const sortedStockNames = stockNames.sort((a, b) => {
    const totalA = chartData.reduce(
      (sum: any, row: any) => sum + (row[a] || 0),
      0
    );
    const totalB = chartData.reduce(
      (sum: any, row: any) => sum + (row[b] || 0),
      0
    );
    return totalB - totalA; // Sort descending
  });

  const getRandomColor = (stock: string) => {
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#d84a8b",
      "#41a3f1",
    ];
    return colors[stockNames.indexOf(stock) % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1b1a21] text-white p-3 rounded-lg shadow-lg w-full">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === "totalAmount" ? "Dividend" : entry.name}:{" "}
              <span className="font-bold">₹{formatNumber(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl text-white bg-[#1b1a21] mt-4">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {/* Chart Type Buttons */}
          <div className="flex space-x-4 m-2">
            {["line", "bar"].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type as "line" | "bar")}
                className={`flex  py-2 border-b-2 ${
                  chartType === type
                    ? "border-[#24ab82] text-white"
                    : "border-gray-400 text-gray-400"
                } hover:border-[#24ab82] transition-colors cursor-pointer text-sm`}
              >
                {type === "line" ? (
                  <ChartLine size={20} className="mr-2" />
                ) : (
                  <ChartColumnIncreasing size={20} className="mr-2" />
                )}{" "}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          {/* Time Period Buttons */}
          <div className="flex space-x-4 m-2">
            {["monthly", "quarterly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setView(type as "monthly" | "quarterly" | "yearly")
                }
                className={`px-2 py-2 border-b-2 ${
                  view === type
                    ? "border-[#24ab82] text-white"
                    : "border-gray-400 text-gray-400"
                } hover:border-[#24ab82] transition-colors cursor-pointer text-sm`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {chartType === "line" ? (
        <div className="rounded-xl">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData.map((row: any) => ({
                ...row,
                totalAmount: parseFloat(
                  Object.keys(row)
                    .filter((key) => key !== "key")
                    .reduce((acc, stock) => acc + (row[stock] as number), 0)
                    .toFixed(2)
                ),
              }))}
            >
              <XAxis dataKey="key" stroke="#8b8a8f" />
              <YAxis
                stroke="#8b8a8f"
                tickFormatter={(value) =>
                  value >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${value}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="totalAmount"
                stroke="#24ab82"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-xl">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="key" stroke="#8b8a8f" />
              <YAxis
                stroke="#8b8a8f"
                tickFormatter={(value) =>
                  value >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${value}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              {sortedStockNames.map((stock) => (
                <Bar
                  key={stock}
                  dataKey={stock}
                  stackId="a"
                  fill={getRandomColor(stock)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DividendChart;
