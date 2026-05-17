import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { ArrowLeft, Users, AlertCircle, X, Send, Search } from 'lucide-react';

const BloodGroupDetails = () => {
  const { bloodGroup } = useParams();
  const decodedBloodGroup = decodeURIComponent(bloodGroup);
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Search
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [requestMode, setRequestMode] = useState('None'); // 'All', 'Individual', 'None'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Local Request Status Tracker
  const [sentRequests, setSentRequests] = useState({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestTarget, setRequestTarget] = useState(null); // specific donor object or 'ALL'
  const [requestData, setRequestData] = useState({
    units: 1,
    hospital: '',
    city: '',
    urgency: 'Normal',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/search?bloodGroup=${encodeURIComponent(decodedBloodGroup)}`);
        setDonors(res.data);
      } catch (error) {
        toast.error('Failed to fetch donors for this blood group');
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, [decodedBloodGroup]);

  const getLocation = (donor) => {
    const parts = [donor.city, donor.state].filter(p => p && p.trim() !== '' && p !== 'undefined' && p !== 'null');
    if (parts.length > 0) {
      return parts.join(', ');
    }
    return donor.location && donor.location !== 'undefined' && donor.location !== 'null' ? donor.location : 'Not Provided';
  };

  // Derived state for locations
  const availableLocations = useMemo(() => {
    const locs = new Set(donors.map(donor => getLocation(donor)));
    return ['All Locations', ...Array.from(locs).sort()];
  }, [donors]);

  // Derived state for filtered donors (location + search)
  const filteredDonors = useMemo(() => {
    let result = donors;
    if (locationFilter !== 'All Locations') {
      result = result.filter(d => getLocation(d) === locationFilter);
    }
    if (searchTerm.trim() !== '') {
      result = result.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return result;
  }, [donors, locationFilter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
  const paginatedDonors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDonors.slice(start, start + itemsPerPage);
  }, [filteredDonors, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [locationFilter, searchTerm]);

  const openRequestModal = (target) => {
    setRequestTarget(target);
    setRequestData({ 
      ...requestData, 
      city: target !== 'ALL' && target.city ? target.city : '' 
    });
    setIsModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsModalOpen(false);
    setRequestTarget(null);
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
    if (!window.confirm('Are you sure you want to send this request?')) {
      return;
    }
    
    setSubmitting(true);
    try {
      const isUrgent = requestData.urgency === 'Urgent' || requestData.urgency === 'Critical';
      const newStatuses = { ...sentRequests };

      if (requestTarget === 'ALL') {
        // Send to all filtered donors
        const promises = filteredDonors.map(donor => 
          api.post('/requests', {
            ...requestData,
            donorId: donor._id,
            bloodGroup: donor.bloodGroup
          })
        );
        await Promise.all(promises);
        
        filteredDonors.forEach(d => {
          newStatuses[d._id] = { status: 'Pending', isUrgent };
        });
        toast.success('Blood request sent successfully 🩸');
      } else {
        // Send to single donor
        await api.post('/requests', {
          ...requestData,
          donorId: requestTarget._id,
          bloodGroup: requestTarget.bloodGroup
        });
        
        newStatuses[requestTarget._id] = { status: 'Pending', isUrgent };
        toast.success('Blood request sent successfully 🩸');
      }
      
      setSentRequests(newStatuses);
      closeRequestModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request(s)');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button 
            onClick={() => navigate('/search-donors')}
            className="flex items-center text-gray-500 hover:text-red-500 transition-colors font-medium group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Blood Groups
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {decodedBloodGroup} Donors
            </h1>
            <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full border border-red-200">
              {filteredDonors.length} Available
            </span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                {availableLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Send Request To</label>
            <div className="relative">
              <select
                value={requestMode}
                onChange={(e) => setRequestMode(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="All">All Filtered Donors</option>
                <option value="Individual">Individual</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex items-end h-full">
            {requestMode === 'All' && filteredDonors.length > 0 && (
              <button 
                onClick={() => openRequestModal('ALL')}
                className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 transform hover:-translate-y-0.5 mt-6 md:mt-0"
              >
                <Send className="w-5 h-5" />
                Request {filteredDonors.length} Donors
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search donor by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 md:w-1/3 pl-10 pr-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="h-64 flex items-center justify-center"><Loader /></div>
        ) : filteredDonors.length > 0 ? (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Blood Group</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Phone Number</th>
                      <th className="px-6 py-4">Availability</th>
                      <th className="px-6 py-4">Request Status</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedDonors.map((donor) => (
                      <tr key={donor._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{donor.name}</td>
                        <td className="px-6 py-4 text-red-600 font-bold">{donor.bloodGroup}</td>
                        <td className="px-6 py-4 text-gray-600">{getLocation(donor)}</td>
                        <td className="px-6 py-4 text-gray-600">{donor.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {donor.available ? 'Available' : 'Unavailable'}
                          </span>
                          {donor.lastDonationDate && (
                            <div className="text-xs text-gray-500 mt-1.5 font-medium">
                              Last Donated: {new Date(donor.lastDonationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {sentRequests[donor._id] ? (
                            <div className="flex flex-col gap-1.5 items-start">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(sentRequests[donor._id].status)}`}>
                                {sentRequests[donor._id].status}
                              </span>
                              {sentRequests[donor._id].isUrgent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                  🚨 Urgent
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 font-medium">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {requestMode === 'Individual' && (
                            <button
                              onClick={() => openRequestModal(donor)}
                              disabled={!donor.available}
                              className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-4 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Send Request
                            </button>
                          )}
                          {requestMode !== 'Individual' && <span className="text-gray-400">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-red-500 text-white shadow-sm' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm max-w-2xl mx-auto mt-8">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No donors found for this blood group in the selected location.
            </h3>
            <p className="text-gray-500 text-lg">
              Try changing the location or blood group.
            </p>
          </div>
        )}

        {/* Request Modal */}
        {isModalOpen && requestTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-extrabold text-gray-900">Request Blood</h3>
                <button onClick={closeRequestModal} className="text-gray-400 hover:text-red-500 transition-colors bg-white p-1 rounded-full shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={submitRequest} className="p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    {requestTarget === 'ALL' ? (
                      <>You are sending a bulk request to <strong>{filteredDonors.length} donors</strong> in <strong>{locationFilter}</strong> for <strong>{decodedBloodGroup}</strong> blood.</>
                    ) : (
                      <>You are requesting <strong>{decodedBloodGroup}</strong> blood from <strong>{requestTarget.name}</strong>. They will be notified via email.</>
                    )}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Units Required</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        required
                        value={requestData.units}
                        onChange={(e) => setRequestData({...requestData, units: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Urgency</label>
                      <select
                        value={requestData.urgency}
                        onChange={(e) => setRequestData({...requestData, urgency: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Hospital Name</label>
                    <input
                      type="text"
                      required
                      value={requestData.hospital}
                      onChange={(e) => setRequestData({...requestData, hospital: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="e.g., Apollo Hospital"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Hospital City</label>
                    <input
                      type="text"
                      required
                      value={requestData.city}
                      onChange={(e) => setRequestData({...requestData, city: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Message (Optional)</label>
                    <textarea
                      rows="3"
                      value={requestData.message}
                      onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                      placeholder="Any specific instructions or details..."
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={closeRequestModal}
                    className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodGroupDetails;
