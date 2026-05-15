import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Activity } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/my');
      setRequests(res.data);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-[80vh]"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Activity className="text-primary-600" />
        All Requests
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map(request => (
              <div key={request._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary-100 text-primary-800 font-bold px-3 py-1 rounded-lg text-sm border border-primary-200">
                        {request.bloodGroup}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        request.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Requested from {request.donor?.name || 'Unknown Donor'}</h3>
                    <p className="text-gray-600 text-sm">{request.hospital}, {request.city}</p>
                    {request.message && (
                      <p className="text-sm text-gray-500 italic mt-2 border-l-2 border-gray-200 pl-2">
                        "{request.message}"
                      </p>
                    )}
                  </div>
                  
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500 mb-1">Requested on</p>
                    <p className="font-medium text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
                    <p className="font-medium text-primary-600 mt-1">{request.units} Units</p>
                    <p className="text-xs text-gray-500 mt-2">Urgency: <span className="font-medium">{request.urgency}</span></p>
                  </div>
                </div>

                {request.status === 'Accepted' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-sm font-medium text-green-800 mb-2">Request Accepted! Contact Donor:</p>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-green-900">
                      <p><strong>Phone:</strong> {request.donor?.phone}</p>
                      <p><strong>Email:</strong> {request.donor?.email}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
