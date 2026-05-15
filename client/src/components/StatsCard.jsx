

const StatsCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${bgColorClass}`}>
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
