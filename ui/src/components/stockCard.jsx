function StockCard({ stock }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-medium">{stock.name}</h3>
      <p>Quantity: {stock.quantity}</p>
      <p>Price: ${stock.price}</p>
      <p>Total Value: ${stock.quantity * stock.price}</p>
    </div>
  );
}

export default StockCard;
