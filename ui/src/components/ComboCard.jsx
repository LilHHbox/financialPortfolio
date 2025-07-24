import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// 注册 Chart.js 插件
ChartJS.register(ArcElement, Tooltip, Legend);

const ComboCard = ({ investments }) => {
  const [isOpen, setIsOpen] = useState(false); // 控制下拉框显示
  const [selectedInvestments, setSelectedInvestments] = useState([]);
  const [investmentColors, setInvestmentColors] = useState({}); // 用于缓存颜色

  // 切换下拉框的显示状态
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 处理选项的选择和取消选择
  const handleSelection = (investment) => {
    setSelectedInvestments((prevSelected) =>
      prevSelected.includes(investment)
        ? prevSelected.filter((item) => item !== investment) // 如果已选择，取消选择
        : [...prevSelected, investment] // 否则，添加到选中数组
    );
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // 缓存投资颜色
  const getInvestmentColor = (investment) => {
    if (investmentColors[investment]) {
      return investmentColors[investment]; // 如果已有颜色则返回
    }
    const color = generateRandomColor(); // 如果没有颜色，生成一个新的颜色
    setInvestmentColors((prevColors) => ({
      ...prevColors,
      [investment]: color,
    }));
    return color;
  };

  // 计算饼图数据
  const calculatePieData = () => {
    const totalInvestments = selectedInvestments.length;
    if (totalInvestments <= 1) return null;

    // 平均分配投资
    const pieData = Array(totalInvestments).fill(100 / totalInvestments);
    const labels = selectedInvestments;

    const backgroundColors = selectedInvestments.map(getInvestmentColor);

    return {
      labels,
      datasets: [
        {
          data: pieData,
          backgroundColor: backgroundColors, // 每个部分的颜色
          hoverOffset: 4,
        },
      ],
    };
  };

  const pieData = calculatePieData();

  return (
    <div className="bg-neutral-800 rounded-lg shadow-md p-6 flex flex-row">
      <div className="w-1/2">
        <h3 className="text-heading-2 text-brand-primary mb-4">Choose Your Portfolio</h3>

        <div className="relative">
          {/* 模拟的选择框 */}
          <div
            id="investmentSelect"
            onClick={toggleDropdown}
            className="bg-neutral-700 text-neutral-100 rounded-md p-2 mt-2 w-4/5 flex justify-between items-center cursor-pointer"
          >
            <span>{selectedInvestments.length > 0 ? `${selectedInvestments.length} selected` : "Choose Investments"}</span>
            {/* 向下箭头 */}
            <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
          </div>

          {/* 下拉框 */}
          {isOpen && (
            <div className="absolute bg-neutral-700 text-neutral-100 rounded-md w-4/5 mt-1 max-h-60 overflow-y-auto z-10">
              {investments.map((investment, index) => (
                <div
                  key={index}
                  onClick={() => handleSelection(investment.name)}
                  className="flex items-center p-2 hover:bg-brand-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedInvestments.includes(investment.name)}
                    readOnly
                    className="mr-2"
                  />
                  <span>{investment.name}</span>
                </div>
              ))}
            </div>
          )}
        
          {/* 显示已选择的投资 */}
          {selectedInvestments.length > 0 && (
            <div className="mt-4">
              <p className="text-body-bold text-neutral-300">You have selected:</p>
              <ul className="list-disc pl-6 text-neutral-300">
                {selectedInvestments.map((investment, index) => (
                  <li key={index} className="text-brand-primary">{investment}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      

      {pieData && (
        <div className="mt-8 w-1/2">
          <p className="text-heading-3 text-neutral-100 mb-2 text-center">Portfolio Distribution</p>
          <Doughnut data={pieData} options={{ responsive: true }} />
        </div>
      )}
    </div>
  );
};

export default ComboCard;
