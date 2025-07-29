import React, { useState } from "react";
import PieChart from "./PieChart";

const ComboCard = ({ investments }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvestments, setSelectedInvestments] = useState([]);
  const [investmentColors, setInvestmentColors] = useState({});
  const [investmentPercentages, setInvestmentPercentages] = useState({});

  // Toggle Dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle Investment Selection
  const handleSelection = (investment) => {
    setSelectedInvestments((prevSelected) =>
      prevSelected.includes(investment)
        ? prevSelected.filter((item) => item !== investment)
        : [...prevSelected, investment]
    );
  };

  // Handle Click Reset Button
  const handleClickReset = () => {
    if (selectedInvestments.length === 0) return;
    const average = 100 / selectedInvestments.length;
    const resetPercentages = {};
    selectedInvestments.forEach((investment) => {
      resetPercentages[investment] = average;
    });
    setInvestmentPercentages(resetPercentages);
  };

  // Handle Percentage Change
  const handlePercentageChange = (investment, percentage) => {
    setInvestmentPercentages((prev) => ({
      ...prev,
      [investment]: percentage,
    }));
  };

  // Generate Random Colors
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Get or generate random colors for investments
  const getInvestmentColor = (investment) => {
    if (investmentColors[investment]) {
      return investmentColors[investment];
    }
    const color = generateRandomColor();
    setInvestmentColors((prevColors) => ({
      ...prevColors,
      [investment]: color,
    }));
    return color;
  };


  return (
    <div className="bg-neutral-800 rounded-lg shadow-md p-6 flex flex-row">
      <div className="w-1/2">
        <h3 className="text-heading-2 font-semibold text-brand-primary mb-4">Choose Your Next Portfolio</h3>
        <div className="relative">
          {/* Dropdown */}
          <div
            id="investmentSelect"
            onClick={toggleDropdown}
            className="bg-neutral-700 text-neutral-100 rounded-md p-3 mt-2 w-full flex justify-between items-center cursor-pointer text-body-bold font-medium"
          >
            <span>{selectedInvestments.length > 0 ? `${selectedInvestments.length} selected` : "Choose Investments"}</span>
            <span className="ml-2 text-body-bold">{isOpen ? "▲" : "▼"}</span>
          </div>

          {/* Dropdown List */}
          {isOpen && (
            <div className="absolute bg-neutral-700 text-neutral-100 rounded-md w-full mt-2 max-h-60 overflow-y-auto z-10 shadow-lg">
              {investments.map((investment, index) => (
                <div
                  key={index}
                  onClick={() => handleSelection(investment.name)}
                  className="flex items-center p-3 hover:bg-brand-600 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedInvestments.includes(investment.name)}
                    readOnly
                    className="mr-3"
                  />
                  <span>{investment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display selected investments with percentage */}
        {selectedInvestments.length > 0 && (
          <div className="mt-6">
            <p className="text-heading-3 font-semibold text-neutral-300">You have selected:</p>
            <ul className="list-none pl-0">
              {selectedInvestments.map((investment, index) => (
                <li key={index} className="text-body text-neutral-200 flex justify-between items-center mt-3">
                  <span className="text-brand-primary">{investment}</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={investmentPercentages[investment] || 100 / selectedInvestments.length}
                      onChange={(e) => handlePercentageChange(investment, Number(e.target.value))}
                      className="w-20 p-2 text-center bg-neutral-600 text-neutral-100 rounded-md"
                      min={0}
                      max={100}
                    />
                    <span className="text-neutral-400">%</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-row p-2 mt-2 justify-between items-center">
              <button
                className="px-2 py-2 rounded bg-brand-500 text-white disabled:opacity-50 text-body"
              >
                Create
              </button>
              <button
                className="px-2 py-2 rounded bg-neutral-400 text-white disabled:opacity-50 text-body"
                onClick={handleClickReset}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedInvestments.length > 1 && (
        <div className="w-1/2">
          <PieChart
            selectedInvestments={selectedInvestments}
            investmentPercentages={investmentPercentages}
            getInvestmentColor={getInvestmentColor}
            onSliceClick={(investment, newValue) => {
              setInvestmentPercentages((prev) => ({
                ...prev,
                [investment]: newValue,
              }));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ComboCard;
