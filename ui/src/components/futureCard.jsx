function FutureCard({ future }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-medium">{future.name}</h3>
      <p>Quantity: {future.quantity}</p>
      <p>Price: ${future.price}</p>
      <p>Total Value: ${future.quantity * future.price}</p>
    </div>
  );
}

export default FutureCard;
