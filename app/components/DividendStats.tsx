import { DividendStatsProps } from "./types/types";
import SimpleCard from "./ui/SimpleCard";
import { formatNumber } from "../utils";

const DividendStats: React.FC<DividendStatsProps> = ({ data }) => {
  const calculateStats = () => {
    const totalDividends = data.reduce(
      (acc, row) => acc + (row.netDividendAmount || 0),
      0
    );

    return {
      totalDividends,
      avgQuarterly: totalDividends / 3,
      avgMonthly: totalDividends / 12,
      avgDaily: totalDividends / 365,
    };
  };

  const { totalDividends, avgQuarterly, avgMonthly, avgDaily } =
    calculateStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 mt-4">
      <SimpleCard title="Total Dividend">
        <p className="text-xl font-semibold text-[#24ab82]">
          ₹{formatNumber(totalDividends)}
        </p>
      </SimpleCard>
      <SimpleCard title="Avg Quarterly Dividend">
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold text-[#24ab82]">
            ₹{formatNumber(avgQuarterly)}
          </p>
        </div>
      </SimpleCard>
      <SimpleCard title="Avg Monthly Dividend">
        <p className="text-xl font-semibold text-[#24ab82]">
          ₹{formatNumber(avgMonthly)}
        </p>
      </SimpleCard>
      <SimpleCard title="Avg Daily Dividend">
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold text-[#24ab82]">
            ₹{formatNumber(avgDaily)}
          </p>
        </div>
      </SimpleCard>
    </div>
  );
};

export default DividendStats;
