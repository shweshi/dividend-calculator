export interface DividendData {
  symbol: string;
  isin: string;
  date: string;
  quantity: number;
  dividendPerShare: number;
  netDividendAmount: number;
}

export interface FileUploaderProps {
  onFileUpload: (data: DividendData[]) => void;
}

export interface DividendStatsProps {
  data: { netDividendAmount: number }[];
}

export interface DividendChartProps {
  data: DividendData[];
}
