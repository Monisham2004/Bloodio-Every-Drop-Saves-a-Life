import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Droplet } from 'lucide-react';
import Loader from '../components/Loader';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const SearchDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await api.get('/donors/search');
        setDonors(res.data);
      } catch (error) {
        console.error('Failed to fetch donors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const getDonorCount = (bg) => {
    return donors.filter((donor) => donor.bloodGroup === bg).length;
  };

  const handleCardClick = (bg) => {
    navigate(`/search-donors/${encodeURIComponent(bg)}`);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Find Blood Donors
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Select the blood group you need to find available donors
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {BLOOD_GROUPS.map((bg) => (
              <div
                key={bg}
                onClick={() => handleCardClick(bg)}
                className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 hover:border-red-400 hover:shadow-[0_8px_30px_-4px_rgba(239,68,68,0.15)] group"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors duration-300">
                  <Droplet className="w-8 h-8 text-red-500 fill-current" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{bg}</h2>
                <p className="text-sm font-medium text-gray-500">
                  {getDonorCount(bg)} {getDonorCount(bg) === 1 ? 'donor' : 'donors'} available
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonors;
