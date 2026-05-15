import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Droplet, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition" onClick={() => setIsOpen(false)}>Home</Link>
      
      {user?.role === 'donor' && (
        <>
          <Link to="/donor/dashboard" className="text-gray-600 hover:text-primary-600 font-medium transition" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/donor/profile" className="text-gray-600 hover:text-primary-600 font-medium transition" onClick={() => setIsOpen(false)}>Profile</Link>
        </>
      )}

      {user?.role === 'recipient' && (
        <>
          <Link to="/recipient/dashboard" className="text-gray-600 hover:text-primary-600 font-medium transition" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/search-donors" className="text-gray-600 hover:text-primary-600 font-medium transition" onClick={() => setIsOpen(false)}>Find Donors</Link>
        </>
      )}

      {user?.role === 'admin' && (
        <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium transition" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Droplet className="h-6 w-6 text-primary-600 fill-primary-600" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">BloodLink</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLinks />
            
            {user ? (
              <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="px-4 pt-2 pb-4 space-y-3 flex flex-col">
            <NavLinks />
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="text-sm font-medium text-gray-500 px-2">Signed in as {user.name}</div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 px-2 py-1 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 font-medium px-2 py-1" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="text-primary-600 font-medium px-2 py-1" onClick={() => setIsOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
