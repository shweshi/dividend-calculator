"use client";

import { useState } from "react";
import FileUploader from "./components/FileUploader";
import DividendStats from "./components/DividendStats";
import DividendChart from "./components/DividendChart";
import DividendPieChart from "./components/DividendPieChart";
import DividendSelector from "./components/DividendSelector";
import DividendInsights from "./components/DividendInsights";
import { DividendData } from "./components/types/types";
import Footer from "./components/Footer";
import { Github } from "lucide-react";

const Home = () => {
  const [data, setData] = useState<DividendData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Extract unique stock symbols
  const stockSymbols = Array.from(new Set(data.map((row) => row.symbol)));

  // Filter data based on selected stock
  const filteredData = selectedSymbol
    ? data.filter((row) => row.symbol === selectedSymbol)
    : data;

  return (
    <div>
      <main className="min-h-screen bg-custom-dark text-white p-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="text-center border-b border-white/10 pb-4">
            <h1 className="text-3xl font-bold text-white mb-1">
              Dividends Calculator & Visualizer
            </h1>
          </div>

          {/* File Uploader */}
          {data.length === 0 && <FileUploader onFileUpload={setData} />}

          {data.length > 0 && (
            <>
              {/* Stock Selector */}
              <div className="mt-4">
                <DividendSelector
                  symbols={stockSymbols}
                  selectedSymbol={selectedSymbol}
                  onSelectSymbol={setSelectedSymbol}
                />
              </div>

              {/* Dividends Overview */}
              <div className="mt-8">
                <h1>Dividends Overview</h1>
                <DividendStats data={filteredData} />
              </div>

              {/* Dividends Insights */}
              <div className="mt-8">
                <h1>Dividends Insights</h1>
                <DividendInsights data={data} selectedSymbol={selectedSymbol} />
              </div>

              {/* Dividend Trends */}
              <div className="mt-8">
                <h1>Dividends Trends</h1>
                <DividendChart data={filteredData} />
              </div>

              {/* Dividend Distribution */}
              <div className="mt-8">
                <h1>Dividends Distribution</h1>
                <DividendPieChart data={filteredData} />
              </div>
            </>
          )}
          {data.length === 0 && <Footer />}
          <div className="mt-8 text-center">
            <a className="flex justify-center items-center" href="https://github.com/shweshi" target="_blank">
              <Github size={20} className="mr-2"/> <span>GitHub</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
