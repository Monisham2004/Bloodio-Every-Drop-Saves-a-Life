import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BloodGroupCard from '../components/BloodGroupCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Search, Droplet } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SearchDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    city: ''
  });
  
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

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.bloodGroup) params.append('bloodGroup', searchParams.bloodGroup);
      if (searchParams.city) params.append('city', searchParams.city);
      
      const res = await api.get(`/donors/search?${params.toString()}`);
      setDonors(res.data);
    } catch (error) {
      toast.error('Failed to search donors');
    } finally {
      setLoading(false);
    }
  };

  const groupedCounts = useMemo(() => {
    const counts = {};
    BLOOD_GROUPS.forEach(bg => {
      counts[bg] = donors.filter(d => d.bloodGroup === bg).length;
    });
    return counts;
  }, [donors]);

  const handleCardClick = (bg) => {
    let url = `/search-donors/${encodeURIComponent(bg)}`;
    if (searchParams.city) {
      url += `?city=${encodeURIComponent(searchParams.city)}`;
    }
    navigate(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight flex items-center justify-center gap-3">
            <Search className="w-8 h-8 text-primary-600" />
            Find Blood Donors
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Select the blood group you need to find available donors
          </p>
        </div>
        
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select
                value={searchParams.bloodGroup}
                onChange={(e) => setSearchParams({ ...searchParams, bloodGroup: e.target.value })}
                className="input-field w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                placeholder="e.g., Bangalore"
                value={searchParams.city}
                onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                className="input-field w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all">
                <Search className="w-5 h-5" /> Search
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {BLOOD_GROUPS.map(bg => {
              const count = groupedCounts[bg];
              if (searchParams.bloodGroup && searchParams.bloodGroup !== bg) return null;
              if (count === 0 && searchParams.city) return null;

              return (
                <BloodGroupCard 
                  key={bg}
                  bloodGroup={bg}
                  count={count}
                  onClick={() => handleCardClick(bg)}
                />
              );
            })}
            {donors.length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                No donors found matching your search criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonors;
