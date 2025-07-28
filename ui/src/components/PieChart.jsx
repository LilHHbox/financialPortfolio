import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import chartAnnotation from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register plugins
ChartJS.register(ArcElement, Tooltip, Legend, chartAnnotation, ChartDataLabels);

const PieChart = ({ selectedInvestments, investmentPercentages, getInvestmentColor, onSliceClick }) => {
  if (!selectedInvestments || selectedInvestments.length <= 1) return null;

  // Compute pie data
  const pieData = {
    labels: selectedInvestments,
    datasets: [
      {
        data: selectedInvestments.map((investment) => investmentPercentages[investment] || 100 / selectedInvestments.length),
        backgroundColor: selectedInvestments.map(getInvestmentColor),
        hoverOffset: 4,
      },
    ],
  };

  // Chart options
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
      if (chartElement.length > 0 && typeof onSliceClick === "function") {
        const { index } = chartElement[0];
        const investment = selectedInvestments[index];
        const current = investmentPercentages[investment] || 100 / selectedInvestments.length;
        const newPercentage = prompt("Enter new percentage", current);

        if (newPercentage && !isNaN(newPercentage)) {
          onSliceClick(investment, parseFloat(newPercentage));
        }
      }
    },
  };

  return (
    <div className="mt-8 w-full">
      <p className="text-heading-3 text-neutral-100 mb-2 text-center">Portfolio Distribution</p>
      <Doughnut data={pieData} options={options} />
    </div>
  );
};

export default PieChart;