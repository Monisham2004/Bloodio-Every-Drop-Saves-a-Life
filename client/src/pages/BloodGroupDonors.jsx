import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import RequestModal from '../components/RequestModal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { ArrowLeft, Users } from 'lucide-react';

const BloodGroupDonors = () => {
  const { bloodGroup } = useParams();
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || '';
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('Individual');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [bulkData, setBulkData] = useState({ bloodGroup: '', donors: [] });
  const [requestData, setRequestData] = useState({
    units: 1,
    hospital: '',
    city: city || '',
    urgency: 'Normal',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, city]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      // Added a timestamp to prevent caching old values
      const t = Date.now();
      const res = await api.get(`/users/search-donors/${encodeURIComponent(bloodGroup)}?t=${t}`);
      
      // Sort donors by city
      let sorted = res.data.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
      
      // If there's a city filter in URL, we can still filter on frontend, 
      // but the user explicitly requested to show ALL users with same blood group from backend.
      if (city) {
        sorted = sorted.filter(d => d.city && d.city.toLowerCase().includes(city.toLowerCase()));
      }
      
      setDonors(sorted);
    } catch (error) {
      toast.error('Failed to search donors');
    } finally {
      setLoading(false);
    }
  };

  const openRequestModal = (donor) => {
    setIsBulkMode(false);
    setSelectedDonor(donor);
    setRequestData({ ...requestData, city: donor.city });
    setIsModalOpen(true);
  };

  const openBulkRequestModal = () => {
    setIsBulkMode(true);
    setSelectedDonor(null);
    setBulkData({ bloodGroup, donors });
    setRequestData({ ...requestData, city: city });
    setIsModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
    setIsBulkMode(false);
    setBulkData({ bloodGroup: '', donors: [] });
    setRequestData({
      units: 1,
      hospital: '',
      city: city || '',
      urgency: 'Normal',
      message: '',
    });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    
    if (isBulkMode) {
      if (!window.confirm(`Send this request to all donors in the ${bloodGroup} group?`)) {
        return;
      }
    }
    
    setSubmitting(true);
    try {
      if (isBulkMode) {
        const res = await api.post('/requests/bulk', {
          ...requestData,
          donorIds: bulkData.donors.map(d => d._id),
          bloodGroup: bloodGroup
        });
        toast.success('Blood request sent successfully 🩸');
      } else {
        await api.post('/requests', {
          ...requestData,
          donorId: selectedDonor._id,
          bloodGroup: selectedDonor.bloodGroup
        });
        toast.success('Blood request sent successfully 🩸');
      }
      closeRequestModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    let url = '/search-donors';
    if (city) {
      url += `?city=${encodeURIComponent(city)}`;
    }
    navigate(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blood Groups
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              {bloodGroup} Blood Donors
            </h1>
            <p className="text-gray-500 mt-1 font-medium">{donors.length} Donors found {city ? `in ${city}` : ''}</p>
          </div>

          {/* Mode Controls */}
          <div className="flex bg-gray-200 p-1.5 rounded-lg shadow-inner">
            {['Individual', 'All', 'None'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                  mode === m 
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100"><Loader /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Bulk Action Button */}
          {mode === 'All' && donors.length > 0 && (
            <div className="p-4 bg-primary-50 border-b border-primary-100 flex justify-center">
              <button
                onClick={openBulkRequestModal}
                className="w-full md:w-2/3 btn-primary py-3 shadow-md hover:shadow-lg font-bold text-lg rounded-xl transition-all hover:-translate-y-0.5"
              >
                Send Request to All Donors in This Group
              </button>
            </div>
          )}

          {/* Donor Table */}
          {donors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                    <th className="p-4 font-semibold w-12 text-center">#</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">City</th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold">Last Donation</th>
                    <th className="p-4 font-semibold text-center">Availability</th>
                    <th className="p-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donors.map((donor, idx) => (
                    <tr key={donor._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-gray-50 transition-colors`}>
                      <td className="p-4 text-center text-gray-400 font-medium">{idx + 1}</td>
                      <td className="p-4 text-gray-900 font-semibold">{donor.name}</td>
                      <td className="p-4 text-gray-600">{donor.city}</td>
                      <td className="p-4 text-gray-600">{donor.phone}</td>
                      <td className="p-4 text-gray-600 text-sm">
                        {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                          donor.available ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20' : 'bg-red-100 text-red-700 ring-1 ring-red-600/20'
                        }`}>
                          {donor.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="p-4 text-center align-middle">
                        {mode === 'Individual' && (
                          <button
                            onClick={() => openRequestModal(donor)}
                            disabled={!donor.available}
                            className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                          >
                            Send Request
                          </button>
                        )}
                        {mode === 'None' && (
                          <button disabled className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed whitespace-nowrap border border-gray-300">
                            Disabled
                          </button>
                        )}
                        {mode === 'All' && (
                          <span className="text-gray-400 font-medium text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No donors available</h3>
              <p>There are currently no donors available for {bloodGroup} {city ? `in ${city}` : ''}.</p>
            </div>
          )}
        </div>
      )}

      <RequestModal 
        isOpen={isModalOpen}
        onClose={closeRequestModal}
        onSubmit={submitRequest}
        isBulkMode={isBulkMode}
        bulkData={bulkData}
        selectedDonor={selectedDonor}
        requestData={requestData}
        setRequestData={setRequestData}
        submitting={submitting}
      />

    </div>
  );
};

export default BloodGroupDonors;
