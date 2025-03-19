import Select from "react-select";

interface DividendSelectorProps {
  symbols: string[];
  selectedSymbol: string | null;
  onSelectSymbol: (symbol: string | null) => void;
}

const DividendSelector: React.FC<DividendSelectorProps> = ({
  symbols,
  selectedSymbol,
  onSelectSymbol,
}) => {
  // Sort symbols alphabetically
  const sortedSymbols = symbols.sort((a, b) => a.localeCompare(b));

  // Convert to `react-select` options format
  const options = [
    { value: "", label: "All Stocks" }, // Default option
    ...sortedSymbols.map((symbol) => ({ value: symbol, label: symbol })),
  ];

  return (
    <Select
      options={options}
      value={options.find((opt) => opt.value === selectedSymbol) || options[0]}
      onChange={(selectedOption) =>
        onSelectSymbol(selectedOption ? selectedOption.value : null)
      }
      isClearable
      placeholder="Select a stock..."
      className="text-black"
      styles={{
        control: (styles, { isFocused }) => ({
          ...styles,
          backgroundColor: "#1b1a21",
          color: "white",
          border: isFocused ? "1px solid #24ab82" : "1px solid #FFFFFF1A",
          boxShadow: isFocused ? "0 0 5px #24ab82" : "none",
          "&:hover": {
            border: "1px solid #24ab82",
          },
          borderRadius: ".75rem",
        }),
        menu: (styles) => ({
          ...styles,
          backgroundColor: "#1b1a21",
        }),
        singleValue: (styles) => ({
          ...styles,
          color: "white",
        }),
        input: (styles) => ({
          ...styles,
          color: "white",
        }),
        option: (styles, { isFocused }) => ({
          ...styles,
          backgroundColor: isFocused ? "#24ab82" : "#1b1a21",
          color: "white",
          cursor: "pointer",
        }),
        dropdownIndicator: (styles, { isFocused }) => ({
          ...styles,
          color: isFocused ? "#24ab82" : "white",
          "&:hover": {
            color: "#24ab82",
          },
        }),
        clearIndicator: (styles, { isFocused }) => ({
          ...styles,
          color: isFocused ? "#24ab82" : "white",
          "&:hover": {
            color: "#24ab82",
          },
        }),
      }}
    />
  );
};

export default DividendSelector;
