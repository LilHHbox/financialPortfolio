function InvestmentCard({ invest, onClick }) {
  return (
    <div
      className="bg-neutral-700 p-4 mb-4 rounded-md shadow-md flex flex-row justify-between cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-body-bold font-semibold text-brand-400">{invest.name}</h3>
      <p className="text-body-bold font-body-bold text-brand-600">Close Yest: {invest.value[invest.value.length - 1]}</p>
    </div>
  );
}

export default InvestmentCard;
