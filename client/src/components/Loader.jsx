import { Loader2 } from 'lucide-react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center h-full w-full ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  );
};

export default Loader;
