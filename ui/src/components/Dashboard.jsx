import React from "react";
import StockCard from "./stockCard.jsx";
import FutureCard from "./futureCard.jsx";
import CashFlowCard from "./cashflowCard.jsx";

function Dashboard() {
  // 假数据
  const stocks = [
    { name: "Apple", quantity: 10, price: 150 },
    { name: "Tesla", quantity: 5, price: 700 },
  ];
  
  const futures = [
    { name: "Gold", quantity: 20, price: 1800 },
    { name: "Oil", quantity: 30, price: 65 },
  ];
  
  const cashFlow = {
    income: 10000,
    expenses: 2500,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-2xl font-semibold">Stocks</h2>
          {stocks.map((stock, index) => (
            <StockCard key={index} stock={stock} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Futures</h2>
          {futures.map((future, index) => (
            <FutureCard key={index} future={future} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Cash Flow</h2>
          <CashFlowCard cashFlow={cashFlow} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
