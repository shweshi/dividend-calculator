import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DividendData } from "./types/types";

const DividendPieChart: React.FC<{ data: DividendData[] }> = ({ data }) => {
  // Process Data: Group dividends by stock
  const dividendByStock = data.reduce<Record<string, number>>((acc, row) => {
    acc[row.symbol] = (acc[row.symbol] || 0) + row.netDividendAmount;
    return acc;
  }, {});

  // Convert to array and sort in descending order
  const chartData = Object.entries(dividendByStock)
    .map(([symbol, amount]) => ({
      name: symbol,
      value: parseFloat(amount.toFixed(2)), // ✅ Limit to 2 decimals
    }))
    .sort((a, b) => b.value - a.value); // Sort Descending

  // Colors for Pie Chart
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#d84a8b",
    "#41a3f1",
  ];

  const totalDividends = data.reduce(
    (acc, row) => acc + (row.netDividendAmount || 0),
    0
  );

  const CustomTooltip = ({ active, payload, total }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percent = total ? (value / total) * 100 : 0; // Calculate % based on total dataset

      return (
        <div
          className="px-3 py-2 rounded-lg"
          style={{ background: "#1b1a21", color: "white" }}
        >
          <p className="text-sm font-semibold">
            {payload[0].name}: ₹
            {new Intl.NumberFormat("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)}
          </p>
          <div>({percent.toFixed(2)}%)</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-xl text-white bg-[#1b1a21] mt-4">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100} // Outer radius for the donut shape
            innerRadius={50} // ✅ Inner radius to create the donut effect
            fill="#8884d8"
            labelLine={(props) => {
              const { cx, cy, midAngle, outerRadius } = props;
              const RADIAN = Math.PI / 180;
              const x = cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN);
              const y = cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN);
              const x2 = cx + (outerRadius + 20) * Math.cos(-midAngle * RADIAN);
              const y2 = cy + (outerRadius + 20) * Math.sin(-midAngle * RADIAN);

              return (
                <polyline
                  points={`${x},${y} ${x2},${y2}`}
                  stroke="white"
                  strokeWidth={1}
                  fill="none"
                />
              );
            }}
            label={({ cx, cy, midAngle, outerRadius, value, name }) => {
              const RADIAN = Math.PI / 180;
              const percentage = (value / totalDividends) * 100;

              if (percentage < 1) return null; // Hide labels if <1%

              const radius = outerRadius + 25; // Move label outside
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize={12}
                >
                  {`${name}: ${percentage.toFixed(2)}%`}
                </text>
              );
            }}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip total={totalDividends} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DividendPieChart;
