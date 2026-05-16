import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import SearchDonors from './pages/SearchDonors';
import BloodGroupDetails from './pages/BloodGroupDetails';
import BloodGroupDonors from './pages/BloodGroupDonors';
import Requests from './pages/Requests';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Donor Routes */}
              <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
                <Route path="/donor/dashboard" element={<DonorDashboard />} />
                <Route path="/donor/profile" element={<Profile />} />
              </Route>

              {/* Protected Recipient Routes */}
              <Route element={<ProtectedRoute allowedRoles={['recipient']} />}>
                <Route path="/recipient/dashboard" element={<RecipientDashboard />} />
              </Route>

              {/* Protected Routes for Recipient or Admin (Search Donors) */}
              <Route element={<ProtectedRoute allowedRoles={['recipient', 'admin']} />}>
                <Route path="/search-donors" element={<SearchDonors />} />
                <Route path="/search-donors/:bloodGroup" element={<BloodGroupDetails />} />
                <Route path="/blood-group-donors/:bloodGroup" element={<BloodGroupDonors />} />
                <Route path="/requests" element={<Requests />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
