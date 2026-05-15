import { useState, useEffect } from 'react';
import api from '../api/axios';
import DonorCard from '../components/DonorCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Search, X, Users, AlertCircle } from 'lucide-react';

const SearchDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    city: ''
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [requestData, setRequestData] = useState({
    units: 1,
    hospital: '',
    city: '',
    urgency: 'Normal',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Initial load
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      // Build query string
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

  const openRequestModal = (donor) => {
    setSelectedDonor(donor);
    setRequestData({ ...requestData, city: donor.city }); // default to donor's city
    setIsModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
    setRequestData({
      units: 1,
      hospital: '',
      city: '',
      urgency: 'Normal',
      message: ''
    });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/requests', {
        ...requestData,
        donorId: selectedDonor._id,
        bloodGroup: selectedDonor.bloodGroup
      });
      toast.success(`Request sent to ${selectedDonor.name}`);
      closeRequestModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Search className="w-6 h-6 text-primary-600" />
          Find Blood Donors
        </h1>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select
              value={searchParams.bloodGroup}
              onChange={(e) => setSearchParams({ ...searchParams, bloodGroup: e.target.value })}
              className="input-field"
            >
              <option value="">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
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
              className="input-field"
            />
          </div>
          
          <div>
            <button type="submit" className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="h-64"><Loader /></div>
      ) : (
        <>
          {donors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map(donor => (
                <DonorCard 
                  key={donor._id} 
                  donor={donor} 
                  onSendRequest={openRequestModal}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-gray-100 text-center shadow-sm">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No donors found</h3>
              <p className="text-gray-500">Try adjusting your search criteria to find available donors.</p>
            </div>
          )}
        </>
      )}

      {/* Request Modal */}
      {isModalOpen && selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Request Blood</h3>
              <button onClick={closeRequestModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={submitRequest} className="p-6">
              <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <p className="text-sm">
                  You are requesting <strong>{selectedDonor.bloodGroup}</strong> blood from <strong>{selectedDonor.name}</strong>. 
                  They will be notified via email and can accept or reject your request.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Units Required</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={requestData.units}
                      onChange={(e) => setRequestData({...requestData, units: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                    <select
                      value={requestData.urgency}
                      onChange={(e) => setRequestData({...requestData, urgency: e.target.value})}
                      className="input-field"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    required
                    value={requestData.hospital}
                    onChange={(e) => setRequestData({...requestData, hospital: e.target.value})}
                    className="input-field"
                    placeholder="e.g., Apollo Hospital"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital City</label>
                  <input
                    type="text"
                    required
                    value={requestData.city}
                    onChange={(e) => setRequestData({...requestData, city: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message (Optional)</label>
                  <textarea
                    rows="3"
                    value={requestData.message}
                    onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                    className="input-field resize-none"
                    placeholder="Any specific instructions or details..."
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary"
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDonors;
