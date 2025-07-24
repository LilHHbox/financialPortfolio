import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// 注册 Chart.js 插件
ChartJS.register(ArcElement, Tooltip, Legend);

function CashFlowChart() {
  const data = {
    labels: ["Income", "Spending"],
    datasets: [
      {
        data: [18665, 42500], // 假数据
        backgroundColor: ["rgb(70, 167, 88)", "rgb(174, 25, 85)"], // 成功色和错误色
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md">
      <h3 className="text-heading-2 text-brand-primary mb-4">Cash Flow</h3>
      <Doughnut data={data} options={{ responsive: true }} />
    </div>
  );
}

export default CashFlowChart;
