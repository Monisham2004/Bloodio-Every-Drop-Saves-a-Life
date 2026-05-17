import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Activity, Clock, Search, ArrowRight, Droplet } from 'lucide-react';

const RecipientDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/my?type=outgoing');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipient Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your blood requests and find donors.</p>
        </div>
        
        <Link to="/search-donors" className="btn-primary flex items-center gap-2">
          <Search className="w-5 h-5" />
          Find Donors
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                Your Recent Requests
              </h2>
              <Link to="/requests" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {requests.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplet className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900">No requests made yet</p>
                <p className="text-sm mt-1">Search for donors in your city to make a request.</p>
                <Link to="/search-donors" className="inline-flex items-center gap-2 text-primary-600 font-medium mt-4 hover:text-primary-700">
                  <Search className="w-4 h-4" /> Start searching
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {requests.slice(0, 5).map(request => (
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
                        <h3 className="text-lg font-bold text-gray-900">Request sent to {request.donor?.name || 'Unknown Donor'}</h3>
                        <p className="text-gray-600 text-sm">{request.hospital}, {request.city}</p>
                      </div>
                      
                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500 mb-1">Requested on</p>
                        <p className="font-medium text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
                        <p className="font-medium text-primary-600 mt-1">{request.units} Units</p>
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

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white shadow-md">
            <h3 className="text-lg font-bold mb-2">Need blood urgently?</h3>
            <p className="text-primary-100 text-sm mb-4">
              Search our database of active donors in your city. Filter by blood group and location to find a match quickly.
            </p>
            <Link to="/search-donors" className="bg-white text-primary-700 px-4 py-2 rounded-lg font-bold text-sm text-center hover:bg-primary-50 transition w-full block">
              Search Now
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-600">Total Requests</span>
                <span className="font-bold text-gray-900">{requests.length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-600">Accepted</span>
                <span className="font-bold text-green-600">
                  {requests.filter(r => r.status === 'Accepted').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'Pending').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;
