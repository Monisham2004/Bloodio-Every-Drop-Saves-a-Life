import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-primary-600 font-black text-9xl mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
