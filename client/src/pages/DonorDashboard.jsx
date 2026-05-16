import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react';

const DonorDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [donor, setDonor] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingDonor, setLoadingDonor] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchDonorProfile();
    fetchRequests();
  }, []);

  const fetchDonorProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setDonor(res.data);
      // Update global context to ensure consistency
      setUser(prev => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error('Failed to load donor profile', error);
    } finally {
      setLoadingDonor(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/my');
      setRequests(res.data);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const toggleAvailability = async () => {
    if (toggling || !donor) return;
    setToggling(true);
    try {
      const targetStatus = !donor.available;
      const res = await api.put('/donors/availability', { available: targetStatus });
      
      const newAvailable = res.data && res.data.available !== undefined ? res.data.available : targetStatus;
      
      setDonor(prev => {
        if (!prev) return prev;
        return { ...prev, available: newAvailable };
      });
      
      setUser(prev => {
        if (!prev) return prev;
        return { ...prev, available: newAvailable };
      });
      
      toast.success('Availability updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    } finally {
      setToggling(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/requests/${id}/status`, { status });
      toast.success(`Request ${status.toLowerCase()}`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  if (loadingDonor || loadingRequests) {
    return <div className="h-[80vh]"><Loader /></div>;
  }
  
  if (!donor || donor.available === undefined) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl inline-block border border-red-100 shadow-sm">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-red-800 mb-1">Unable to load donor information</h2>
          <p className="text-red-600 text-sm">Please try refreshing the page or logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your blood donation requests and availability.</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <span className="font-medium text-gray-700">Availability Status:</span>
          <button
            onClick={toggleAvailability}
            disabled={toggling}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              donor?.available ? 'bg-green-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                donor?.available ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={donor?.available ? 'text-green-600 font-bold' : 'text-gray-500 font-bold'}>
            {donor?.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-600" />
            Incoming Requests
          </h2>
        </div>

        {requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium">No requests yet</p>
            <p className="text-sm">When someone requests your blood group, it will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map(request => (
              <div key={request._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    {request.status === 'Pending' ? (
                      <>
                        <h3 className="text-xl font-bold text-red-600 mb-4">Emergency Blood Request 🩸</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex"><span className="w-32 font-semibold text-gray-900">Recipient Name:</span> <span>{request.recipient?.name || 'Unknown'}</span></div>
                          <div className="flex"><span className="w-32 font-semibold text-gray-900">Blood Group:</span> <span className="text-red-600 font-bold">{request.bloodGroup}</span></div>
                          <div className="flex"><span className="w-32 font-semibold text-gray-900">Location:</span> <span>{request.hospital}, {request.city}</span></div>
                          <div className="flex"><span className="w-32 font-semibold text-gray-900">Phone:</span> <span>{request.recipient?.phone || 'Unknown'}</span></div>
                          <div className="flex"><span className="w-32 font-semibold text-gray-900">Status:</span> <span className="text-yellow-600 font-medium">Pending</span></div>
                        </div>
                        {request.message && (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm mt-3">
                            <span className="font-medium text-gray-700">Message: </span>
                            {request.message}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">{request.hospital}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                            request.urgency === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {request.urgency}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                            request.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="block text-gray-400">Patient/Recipient</span>
                            <span className="font-medium">{request.recipient?.name || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">Units Needed</span>
                            <span className="font-medium text-primary-600">{request.units} Units</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">City</span>
                            <span className="font-medium">{request.city}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">Date</span>
                            <span className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {request.message && (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                            <span className="font-medium text-gray-700">Message: </span>
                            {request.message}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {request.status === 'Pending' && (
                    <div className="flex md:flex-col gap-3 min-w-[140px] justify-center">
                      <button 
                        onClick={() => updateRequestStatus(request._id, 'Accepted')}
                        disabled={updating}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Accept
                      </button>
                      <button 
                        onClick={() => updateRequestStatus(request._id, 'Rejected')}
                        disabled={updating}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition font-medium flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}

                  {request.status === 'Accepted' && (
                    <div className="flex md:flex-col gap-3 min-w-[140px] justify-center border-l pl-6 border-gray-100">
                      <div className="text-sm mb-2">
                        <p className="font-medium text-gray-900">Contact details:</p>
                        <p className="text-gray-600">{request.recipient?.phone}</p>
                        <p className="text-gray-600">{request.recipient?.email}</p>
                      </div>
                      <button 
                        onClick={() => updateRequestStatus(request._id, 'Completed')}
                        disabled={updating}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Mark Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
