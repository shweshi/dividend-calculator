import { useMemo } from "react";
import { DividendData } from "./types/types";

interface DividendInsightsProps {
  data: DividendData[];
  selectedSymbol: string | null;
}

const DividendInsights: React.FC<DividendInsightsProps> = ({ data, selectedSymbol }) => {
  const insights = useMemo(() => {
    if (!data.length) return null;

    // Group by stock symbol and sum dividends
    const stockDividends = data.reduce((acc, row) => {
      acc[row.symbol] = (acc[row.symbol] || 0) + row.netDividendAmount;
      return acc;
    }, {} as Record<string, number>);

    // Calculate total dividends across all stocks
    const totalDividends = Object.values(stockDividends).reduce(
      (sum, val) => sum + val,
      0
    );

    // Sort stocks by highest dividend
    const sortedStocks = Object.entries(stockDividends).sort(
      (a, b) => b[1] - a[1]
    );

    // Get selected stock's actual contribution percentage
    const selectedStockAmount = selectedSymbol ? stockDividends[selectedSymbol] || 0 : 0;
    const selectedStockPercent = selectedSymbol
      ? (selectedStockAmount / totalDividends) * 100
      : null;

    // If no stock is selected, show top contributors
    const topStock = sortedStocks[0];
    const top3Total = sortedStocks
      .slice(0, 3)
      .reduce((sum, [, val]) => sum + val, 0);

    // Find monthly trends
    const monthDividends = data.reduce((acc, row) => {
      const month = new Date(row.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + row.netDividendAmount;
      return acc;
    }, {} as Record<string, number>);

    const monthEntries = Object.entries(monthDividends);
    const highestMonth = monthEntries.sort((a, b) => b[1] - a[1])[0];
    const lowestMonth = monthEntries.sort((a, b) => a[1] - b[1])[0];

    return {
      selectedStock: selectedSymbol
        ? { name: selectedSymbol, percent: selectedStockPercent }
        : null,
      topStock: topStock
        ? { name: topStock[0], percent: (topStock[1] / totalDividends) * 100 }
        : null,
      top3Percent: (top3Total / totalDividends) * 100,
      highestMonth: highestMonth ? highestMonth[0] : null,
      lowestMonth: lowestMonth ? lowestMonth[0] : null,
    };
  }, [data, selectedSymbol]);

  if (!insights) return null;

  return (
    <div className="bg-[#1b1a21] text-white p-4 rounded-lg mt-4">
      <ul className="text-sm">
        {insights.selectedStock ? (
          <li>
            🔹 <b>{insights.selectedStock.name}</b> contributes{" "}
            <b>{insights.selectedStock.percent?.toFixed(2)}%</b> of your total
            dividends.
          </li>
        ) : (
          insights.topStock && (
            <li>
              🔹 <b>{insights.topStock.name}</b> contributes{" "}
              <b>{insights.topStock.percent.toFixed(2)}%</b> of your total
              dividends.
            </li>
          )
        )}
        {insights.highestMonth && (
          <li>🔹 Highest dividend month: <b>{insights.highestMonth}</b></li>
        )}
        {insights.lowestMonth && (
          <li>🔹 Lowest dividend month: <b>{insights.lowestMonth}</b></li>
        )}
        {!selectedSymbol && (
          <li>
            🔹 Top 3 stocks contribute{" "}
            <b>{insights.top3Percent.toFixed(2)}%</b> of your dividends.
          </li>
        )}
      </ul>
    </div>
  );
};

export default DividendInsights;
