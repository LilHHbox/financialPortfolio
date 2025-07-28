import React, { useState } from "react";
import InvestmentCard from "./InvestmentCard";
import NetWorthChart from "./NetWorthChart";
import ComboCard from "./ComboCard";
import TopNavBar from "./TopNavBar";
import PortfolioCard from "./PortfolioCard";

function Dashboard() {
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

  const portfolios = [
    { name: "portfolio 1" }, { name: "portfolio 2" }, { name: "portfolio 3" }
  ]
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(investment.length / itemsPerPage);
  const paginatedInvestment = investment.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleInvestmentClick = (investment) => {
    setSelectedInvestment(investment);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-default-font px-4 py-4 lg:px-8">
      <TopNavBar />
      <div className="px-6 mt-24 flex flex-col space-y-12">
        {/* 上半部分 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左：Stock List */}
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold text-brand-primary mb-4">Stock List</h2>
            {paginatedInvestment.map((invest, index) => (
              <InvestmentCard key={index} invest={invest} onClick={() => handleInvestmentClick(invest)} />
            ))}
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 rounded bg-brand-600 text-white disabled:opacity-50 text-body"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span className="text-subtext-color">Page {currentPage} of {totalPages}</span>
              <button
                className="px-4 py-2 rounded bg-brand-600 text-white disabled:opacity-50 text-body"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>

          {/* 右：Net Worth Chart */}
          <div className="col-span-2">
            <NetWorthChart investment={selectedInvestment} />
          </div>
        </div>

        {/* 下半部分 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左：Portfolios */}
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold text-brand-primary mb-4">Portfolios</h2>
            {portfolios.map((portfolio, index) => (
              <PortfolioCard key={index} portfolio={portfolio} onClick={() => console.log("Details of Portfolio")} />
            ))}
          </div>

          {/* 右：ComboCard */}
          <div className="col-span-2">
            <ComboCard investments={investment} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
