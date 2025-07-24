import React, { useState } from "react";
import InvestmentCard from "./InvestmentCard";
import NetWorthChart from "./NetWorthChart";
// import CashFlowChart from "./CashFlowChart";

function Dashboard() {
  // 假数据
  const investment = [
  { name: "Beneke Fabricators", value: [23.61, 22.78, 23.46, 24.15, 24.66, 24.79, 25.01, 24.61, 23.99, 24.02] },
  { name: "Apple Inc.", value: [214.15, 213.14, 212.10, 210.87, 210.57, 210.30, 209.11, 208.62, 211.16, 212.41] },
  { name: "Tesla Inc.", value: [332.56, 329.74, 334.40, 321.66, 323.15, 312.80, 323.15, 317.06, 318.45, 319.90] },
  { name: "Microsoft Corporation", value: [505.87, 510.97, 514.64, 511.70, 514.64, 505.27, 505.27, 505.27, 510.06, 506.50] },
  { name: "Amazon.com Inc.", value: [228.29, 223.52, 223.82, 242.06, 242.52, 219.39, 219.39, 211.99, 211.99, 220.46] },
  { name: "Alphabet Inc.", value: [190.23, 192.36, 193.36, 207.22, 208.70, 185.94, 184.70, 184.70, 191.51, 191.51] },
  { name: "Meta Platforms Inc.", value: [713.58, 704.81, 716.19, 738.09, 747.90, 627.06, 626.59, 641.84, 641.84, 640.00] },
  { name: "NVIDIA Corporation", value: [170.78, 171.26, 173.00, 174.25, 174.25, 158.24, 158.24, 158.24, 170.70, 169.59] },
  { name: "Netflix Inc.", value: [1176.78, 1230.38, 1232.37, 1339.13, 1341.15, 1209.24, 1209.24, 1233.27, 1246.50, 1250.31] },
  { name: "Adobe Inc.", value: [372.46, 373.49, 373.72, 373.72, 373.72, 369.44, 369.44, 369.44, 373.49, 373.49] },
  { name: "Taiwan Semiconductor Manufacturing", value: [240.33, 238.85, 242.68, 242.68, 242.68, 236.40, 236.40, 236.40, 238.85, 238.85] }
  ];

  const [selectedInvestment, setSelectedInvestment] = useState(null);

  const handleInvestmentClick = (investment) => {
    setSelectedInvestment(investment);
  };


  return (
    <div className="p-6 bg-neutral-900 text-default-font">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left section */}
        <div className="col-span-1 lg:col-span-1">
          <h2 className="text-2xl font-semibold text-brand-primary mb-4">Investments</h2>
          {investment.map((invest, index) => (
            <InvestmentCard key={index} invest={invest} onClick={() => handleInvestmentClick(invest)} />
          ))}
        </div>

        {/* Right section */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          {/* Net Worth Chart */}
          <NetWorthChart investment={selectedInvestment}/>

          {/* Cash Flow Chart */}
          {/* <CashFlowChart /> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
