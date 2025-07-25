import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import chartAnnotation from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register the necessary Chart.js plugins
ChartJS.register(ArcElement, Tooltip, Legend, chartAnnotation, ChartDataLabels);

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

  // Calculate Pie Data
  const calculatePieData = () => {
    const totalInvestments = selectedInvestments.length;
    if (totalInvestments <= 1) return null;

    const pieData = selectedInvestments.map((investment) => {
      return investmentPercentages[investment] || 100 / totalInvestments;
    });

    const labels = selectedInvestments;
    const backgroundColors = selectedInvestments.map(getInvestmentColor);

    return {
      labels,
      datasets: [
        {
          data: pieData,
          backgroundColor: backgroundColors,
          hoverOffset: 4,
        },
      ],
    };
  };

  // Pie Chart Options with Annotation and Data Labels
  const pieData = calculatePieData();
  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
        formatter: (value, context) => `${context.chart.data.labels[context.dataIndex]}: ${value}%`,
        color: '#fff',
      },
      annotation: {
        annotations: selectedInvestments.map((investment, index) => ({
          type: 'box',
          xMin: index - 0.4,
          xMax: index + 0.4,
          backgroundColor: getInvestmentColor(investment),
          borderWidth: 2,
          borderColor: '#fff',
          label: {
            content: `${investmentPercentages[investment] || 100 / selectedInvestments.length}%`,
            position: 'center',
            font: { size: 16 },
          },
        })),
      },
    },
    onClick: (event, chartElement) => {
      if (chartElement.length > 0) {
        const { index } = chartElement[0];
        const investment = selectedInvestments[index];
        const currentPercentage = investmentPercentages[investment] || 100 / selectedInvestments.length;
        const newPercentage = prompt("Enter new percentage", currentPercentage);

        if (newPercentage && !isNaN(newPercentage)) {
          const updatedPercentages = { ...investmentPercentages, [investment]: parseFloat(newPercentage) };
          setInvestmentPercentages(updatedPercentages);
        }
      }
    },
  };

  return (
    <div className="bg-neutral-800 rounded-lg shadow-md p-6 flex flex-row">
      <div className="w-1/2">
        <h3 className="text-heading-2 font-semibold text-brand-primary mb-4">Choose Your Portfolio</h3>
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
          </div>
        )}
      </div>

      {pieData && (
        <div className="mt-8 w-1/2">
          <p className="text-heading-3 text-neutral-100 mb-2 text-center">Portfolio Distribution</p>
          <Doughnut data={pieData} options={options} />
        </div>
      )}
    </div>
  );
};

export default ComboCard;
