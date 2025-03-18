"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";
import Select from "react-select";

// Define types for Excel data and formatted data
interface ExcelRow {
  __EMPTY: string;
  __EMPTY_1: string;
  __EMPTY_2: string;
  __EMPTY_3: number;
  __EMPTY_4: number;
  __EMPTY_5: number;
  [key: string]: any; // For any other dynamic columns
}

interface DividendData {
  symbol: string;
  isin: string;
  date: string;
  quantity: number;
  dividendPerShare: number;
  netDividendAmount: number;
}

interface SelectOption {
  value: string;
  label: string;
}

export default function Home() {
  const [data, setData] = useState<DividendData[]>([]);
  const [view, setView] = useState("monthly");
  const [selectedSymbol, setSelectedSymbol] = useState<SelectOption | null>(
    null
  );

  const handleFileUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target) return;
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet) as ExcelRow[];

      // Fix column mapping
      const formattedData = parsedData.map((row: ExcelRow) => ({
        symbol: row["__EMPTY"] || "Unknown",
        isin: row["__EMPTY_1"] || "Unknown",
        date: row["__EMPTY_2"] || "Unknown",
        quantity: row["__EMPTY_3"] || 0,
        dividendPerShare: row["__EMPTY_4"] || 0,
        netDividendAmount: row["__EMPTY_5"] || 0,
      }));

      setData(formattedData);

      const startIndex = formattedData.findIndex(
        (row) => row.symbol === "Symbol" && row.isin === "ISIN"
      );

      const endIndex = formattedData.findIndex(
        (row) => row.symbol === "Total Dividend Amount"
      );

      if (startIndex !== -1) {
        setData(
          formattedData.slice(
            startIndex + 1,
            endIndex !== -1 ? endIndex : undefined
          )
        );
      }
    };
    reader.readAsBinaryString(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles[0]),
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
  });

  const filteredData = selectedSymbol?.value
    ? data.filter((row) => row.symbol === selectedSymbol.value)
    : data;

  const calculateStats = () => {
    const totalDividends = filteredData.reduce(
      (acc, row) => acc + (row.netDividendAmount || 0),
      0
    );
    return {
      totalDividends,
      avgMonthly: totalDividends / 12,
      avgDaily: totalDividends / 365,
    };
  };

  const { totalDividends, avgMonthly, avgDaily } = calculateStats();

  const dividendBySymbol = Object.entries(
    filteredData.reduce<Record<string, number>>((acc, row) => {
      if (!acc[row.symbol]) {
        acc[row.symbol] = 0;
      }
      acc[row.symbol] += row.netDividendAmount || 0;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const sortedDividends = dividendBySymbol.sort((a, b) => b[1] - a[1]);
  const top5 = sortedDividends.slice(0, 5);
  const othersTotal = sortedDividends
    .slice(5)
    .reduce((acc, [, amount]) => acc + amount, 0);

  const finalLabels = top5.map(([symbol]) => symbol);
  const finalData = top5.map(([, amount]) => amount);

  if (othersTotal > 0) {
    finalLabels.push("Others");
    finalData.push(othersTotal);
  }

  const totalDividend = finalData.reduce((acc, val) => acc + val, 0);

  const pieChartData = {
    labels: finalLabels,
    datasets: [
      {
        data: finalData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#7d7d7d",
        ],
      },
    ],
  };

const processData = (data: DividendData[], type: 'monthly' | 'quarterly' | 'yearly') => {
    const groupedData: Record<string, number> = {};

    data.forEach((row) => {
    const date = new Date(row.date);
    let key: string | undefined;

    if (type === "monthly") {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    } else if (type === "quarterly") {
        key = `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;
    } else if (type === "yearly") {
        key = `${date.getFullYear()}`;
    }

    // Skip if key is undefined
    if (typeof key === 'undefined') return;

    if (!groupedData[key]) groupedData[key] = 0;
    groupedData[key] += row.netDividendAmount || 0;
    });

    return {
      labels: Object.keys(groupedData),
      datasets: [
        {
          label: `Dividends (${type})`,
          data: Object.values(groupedData),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    };
  };

  const barChartData = processData(filteredData, view);

  return (
    <div>
      <main className="min-h-screen bg-custom-dark text-white p-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="mb-4 sm:mb-6 mb-8">
            <div className="text-center border-b border-white/10 pb-4">
              <h1 className="text-3xl font-bold text-white mb-1">
                Dividend Calculator & Visualizer
              </h1>
              <p className="text-sm text-gray-400 sm:w-150 mx-auto mt-2">
                Effortlessly calculate and visualize your dividend income.
              </p>
            </div>
            {data.length > 0 && (
              <div className="py-4">
                <Select
                  options={Array.from(
                    new Set(data.map((row) => row.symbol))
                  ).map((symbol) => ({ value: symbol, label: symbol }))}
                  isClearable
                  placeholder="Search or select a stock..."
                  onChange={setSelectedSymbol}
                  className="text-black"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      width: "100%",
                      backgroundColor: "#ffffff0d",
                      borderRadius: ".75rem",
                      borderWidth: "1px",
                      paddingBottom: ".75rem",
                      paddingTop: ".75rem",
                      borderColor: state.isFocused ? "#3b82f6" : "#ffffff1a",
                    }),
                    singleValue: (baseStyles) => ({
                      ...baseStyles,
                      color: "white", // Selected option text in white
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: "#1e2431",
                    }),
                    option: (baseStyles, { isSelected }) => ({
                      ...baseStyles,
                      backgroundColor: isSelected ? "#3b82f6" : "white",
                      color: "black", // Other options in black
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        color: "white",
                      },
                    }),
                  }}
                />
              </div>
            )}

            {data.length === 0 && (
              <div className="mt-8 w-max mx-auto">
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-600 p-6 rounded-lg mt-4 text-center cursor-pointer bg-card-dark h-40"
                >
                  <input {...getInputProps()} />
                  <p className="mt-2 text-gray-300">
                    {isDragActive
                      ? "Drop the xlsx file here..."
                      : "Drop the xlsx file here or click to select file."}
                  </p>
                </div>
              </div>
            )}

            {data.length > 0 && (
              <div className="mx-auto">
                <div className="text-left">
                  <p className="text-3xl mx-auto py-4">Total Dividend</p>
                  {data.length && (
                    <div className="flex justify-between">
                      <p className="text-lg text-gray-500">
                        Annual Dividend <br />
                        <span className="text-lg text-white mx-auto">
                          ₹{totalDividends.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-lg text-gray-500">
                        Avg Monthly <br />
                        <span className="text-lg text-white">
                          ₹{avgMonthly.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-lg text-gray-500">
                        Avg Daily <br />
                        <span className="text-lg text-white">
                          ₹{avgDaily.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-left">
                  <p className="text-3xl mx-auto py-8">Dividend</p>
                  {dividendBySymbol.length > 0 ? (
                    <div>
                      <div className="flex gap-2">
                        {["monthly", "quarterly", "yearly"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setView(type)}
                            className={`px-6 py-3 rounded-xl border border-white/10 transition-all backdrop-blur-sm flex items-center gap-2
        ${
          view === type
            ? "bg-blue-500 text-white"
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>

                      <div className="w-full h-96">
                        <Bar
                          data={barChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: { beginAtZero: true },
                            },
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">No dividend data available</p>
                  )}
                </div>

                <div className="text-left">
                  <p className="text-3xl mx-auto py-8">Dividend By Stocks</p>
                  {dividendBySymbol.length > 0 ? (
                    <div className="w-full h-100">
                      <Doughnut
                        data={pieChartData}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                          plugins: {
                            legend: {
                              display: true,
                              position:
                                window.innerWidth >= 640 ? "right" : "bottom",
                              labels: {
                                color: "white",
                                generateLabels: (chart) => {
                                  return chart.data.labels.map((label, i) => {
                                    const value =
                                      chart.data.datasets[0].data[i];
                                    const percentage = (
                                      (value / totalDividend) *
                                      100
                                    ).toFixed(1);
                                    return {
                                      text: `${label}: ₹${value} (${percentage}%)`, // Show label, amount, and %
                                      fillStyle:
                                        chart.data.datasets[0].backgroundColor[
                                          i
                                        ],
                                      fontColor: "white",
                                      hidden: false,
                                    };
                                  });
                                },
                              },
                            },
                            tooltip: { enabled: true },
                            datalabels: {
                              color: "white",
                              anchor: "center",
                              align: "start",
                              formatter: (value, context) => {
                                const percentage = (
                                  (value / totalDividend) *
                                  100
                                ).toFixed(1);
                                const symbol =
                                  context.chart.data.labels[context.dataIndex]; // Get symbol name
                                return `${symbol}\n₹${value} (${percentage}%)`; // Show symbol, amount & percentage
                              },
                            },
                          },
                        }}
                        plugins={[ChartDataLabels]}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-400">No dividend data available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {data.length === 0 && (
          <footer className="bg-gray-900 text-white p-4 text-center mt-8">
            <div className="mt-4 text-sm text-gray-300 text-center">
              <div className="inline-block text-left">
                <p>
                  1. Login to your <strong>Zerodha Console</strong>.
                </p>
                <p>
                  2. Navigate to{" "}
                  <strong>
                    Reports &gt; Downloads &gt; Select Statment &gt; Dividend
                    statement
                  </strong>
                  .
                </p>
                <p>3. Select the desired time range.</p>
                <p>
                  4. Click on <strong>Download</strong> and choose the{" "}
                  <strong>XLSX</strong> format.
                </p>
                <p>5. Upload the downloaded file here.</p>
              </div>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}
