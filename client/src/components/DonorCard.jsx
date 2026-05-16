import { useState } from 'react';
import { MapPin, Phone, Droplet } from 'lucide-react';

const DonorCard = ({ donor, onSendRequest }) => {
  return (
    <div className="card hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          donor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {donor.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      
      <div className="flex items-start gap-4">
        <div className="bg-primary-50 rounded-full p-4 flex items-center justify-center border-2 border-primary-100">
          <div className="text-center">
            <Droplet className="w-6 h-6 text-primary-600 mx-auto fill-primary-600" />
            <span className="block text-lg font-bold text-primary-700 mt-1">{donor.bloodGroup}</span>
          </div>
        </div>
        
        <div className="flex-1 mt-1">
          <h3 className="text-xl font-bold text-gray-900">{donor.name}</h3>
          
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{donor.city}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{donor.phone}</span>
            </div>
          </div>
        </div>
      </div>
      
      {onSendRequest && (
        <div className="mt-6">
          <button
            onClick={() => onSendRequest(donor)}
            disabled={!donor.available}
            className="w-full btn-primary flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorCard;
