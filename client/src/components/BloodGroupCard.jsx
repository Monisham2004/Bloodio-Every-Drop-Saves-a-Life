import { Droplet } from 'lucide-react';

const BloodGroupCard = ({ bloodGroup, count, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white hover:border-red-400 transition-all duration-300 transform hover:-translate-y-1 rounded-2xl shadow-sm hover:shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer border border-gray-100 group"
    >
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors duration-300">
        <Droplet className="w-8 h-8 text-red-500 fill-current" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{bloodGroup}</h2>
      <p className="text-sm font-medium text-gray-500 mb-4">{count} {count === 1 ? 'donor' : 'donors'} available</p>
      <div className="text-red-500 font-semibold text-sm group-hover:underline">View Donors &rarr;</div>
    </div>
  );
};

export default BloodGroupCard;
