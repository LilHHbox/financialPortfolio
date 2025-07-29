const PortfolioCard = ({portfolio, onClick}) => {
    return (
      <div
        className="bg-neutral-800 p-4 mb-2 rounded-md shadow-md flex flex-row justify-between cursor-pointer"
        onClick={onClick}
      >
        <h3 className="text-body-bold font-semibold text-brand-400">{portfolio.name}</h3>
      </div>
    );
}

export default PortfolioCard;