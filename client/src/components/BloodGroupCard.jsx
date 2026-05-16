const BloodGroupCard = ({ bloodGroup, count, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1 rounded-xl shadow-md hover:shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer h-48 border border-red-400"
    >
      <h2 className="text-5xl font-extrabold text-white mb-2">{bloodGroup}</h2>
      <p className="text-red-100 font-medium text-lg">({count} Donors)</p>
    </div>
  );
};

export default BloodGroupCard;
