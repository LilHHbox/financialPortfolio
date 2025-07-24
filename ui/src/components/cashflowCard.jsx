function CashFlowCard({ cashFlow }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-medium">Cash Flow</h3>
      <p>Income: ${cashFlow.income}</p>
      <p>Expenses: ${cashFlow.expenses}</p>
      <p>Balance: ${cashFlow.income - cashFlow.expenses}</p>
    </div>
  );
}

export default CashFlowCard;
