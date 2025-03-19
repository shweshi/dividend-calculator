import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { DividendData, FileUploaderProps } from "./types/types";
import { Upload } from "lucide-react";

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const handleFileUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target) return;
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet) as any[];

      // Fix column mapping
      const formattedData: DividendData[] = parsedData.map((row) => ({
        symbol: row["__EMPTY"] || "Unknown",
        isin: row["__EMPTY_1"] || "Unknown",
        date: row["__EMPTY_2"] || "Unknown",
        quantity: row["__EMPTY_3"] || 0,
        dividendPerShare: row["__EMPTY_4"] || 0,
        netDividendAmount: row["__EMPTY_5"] || 0,
      }));

      // Extract relevant data
      const startIndex = formattedData.findIndex(
        (row) => row.symbol === "Symbol" && row.isin === "ISIN"
      );
      const endIndex = formattedData.findIndex(
        (row) => row.symbol === "Total Dividend Amount"
      );

      if (startIndex !== -1) {
        onFileUpload(
          formattedData.slice(
            startIndex + 1,
            endIndex !== -1 ? endIndex : undefined
          )
        );
      } else {
        onFileUpload(formattedData);
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

  return (
    <div className="mt-8 w-max mx-auto">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-600 p-6 rounded-lg mt-4 text-center cursor-pointer bg-card-dark h-40"
      >
        <input {...getInputProps()} />
        <Upload size={40} className="text-gray-400 mb-2 mx-auto" />
        <p className="mt-2 text-gray-500">
          {isDragActive
            ? "Drop the xlsx file here..."
            : "Drop the xlsx file here or click to select file."}
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
