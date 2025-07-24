import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// 注册 Chart.js 插件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function NetWorthChart({ investment }) {
  // 默认数据：如果没有投资数据，则展示上周的 Net Worth 数据
  const netWorth = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // 一周的数据
    datasets: [
      {
        label: "Net Worth",
        data: [2300000, 2310000, 2320000, 2325000, 2330000, 2340000, 2350000], // 假数据
        borderColor: "rgb(70, 167, 88)", // 使用你的 brand-primary 颜色
        backgroundColor: "rgba(70, 167, 88, 0.2)",
        fill: true,
        tension: 0.4, // 平滑线条
      },
    ],
  };

  // 如果 investment 存在，使用其数据，否则使用默认的 netWorth 数据
  let data;
  if (investment) {
    data = {
      labels: ["7.15", "7.16", "7.17", "7.18", "7.19", "7.20", "7.21", "7.22", "7.23", "7.24"], // 假数据
      datasets: [
        {
          label: investment.name,
          data: investment.value, // 使用选中的投资的值
          borderColor: "rgb(70, 167, 88)", // 使用品牌颜色
          backgroundColor: "rgba(70, 167, 88, 0.2)",
          fill: true,
          tension: 0.4, // 平滑线条
        },
      ],
    };
  } else {
    // 默认情况下，使用 netWorth 数据
    data = netWorth;
  }

  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md">
      <h3 className="text-heading-2 text-brand-primary mb-4">
        {investment ? `Trend Chart - ${investment.name}` : "Net Worth Last Week"}
      </h3>
      <Line data={data} options={{ responsive: true }} />
    </div>
  );
}

export default NetWorthChart;
