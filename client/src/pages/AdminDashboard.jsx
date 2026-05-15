import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import StatsCard from '../components/StatsCard';
import toast from 'react-hot-toast';
import { Users, Droplet, Activity, CheckCircle, Ban, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/block`);
      toast.success('User status updated');
      fetchData(); // Refresh list
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) return <div className="h-[80vh]"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Donors" 
          value={stats?.totalDonors || 0} 
          icon={Users} 
          colorClass="text-blue-600" 
          bgColorClass="bg-blue-50" 
        />
        <StatsCard 
          title="Total Requests" 
          value={stats?.totalRequests || 0} 
          icon={Activity} 
          colorClass="text-orange-600" 
          bgColorClass="bg-orange-50" 
        />
        <StatsCard 
          title="Completed Donations" 
          value={stats?.completedDonations || 0} 
          icon={CheckCircle} 
          colorClass="text-green-600" 
          bgColorClass="bg-green-50" 
        />
        <StatsCard 
          title="Most Requested" 
          value={stats?.mostRequestedBloodGroup || 'N/A'} 
          icon={Droplet} 
          colorClass="text-primary-600" 
          bgColorClass="bg-primary-50" 
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      user.role === 'donor' ? 'bg-primary-50 text-primary-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {user.role} {user.role === 'donor' && `(${user.bloodGroup})`}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">{user.phone}</div>
                    <div className="text-xs text-gray-500">{user.city}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleBlockUser(user._id)}
                      className={`p-2 rounded-lg transition ${
                        user.isBlocked 
                          ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                          : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                      }`}
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
