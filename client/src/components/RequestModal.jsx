import { X, AlertCircle } from 'lucide-react';

const RequestModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isBulkMode, 
  bulkData, 
  selectedDonor, 
  requestData, 
  setRequestData, 
  submitting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8 relative">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            {isBulkMode ? "Bulk Blood Request" : "Request Blood"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
            <p className="text-sm">
              {isBulkMode ? (
                <>You are sending a bulk request to <strong>all {bulkData.donors.length} donors in the {bulkData.bloodGroup} group</strong>. They will be notified via email.</>
              ) : (
                <>You are requesting <strong>{selectedDonor?.bloodGroup}</strong> blood from <strong>{selectedDonor?.name}</strong>. They will be notified via email.</>
              )}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Units Required</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={requestData.units}
                  onChange={(e) => setRequestData({...requestData, units: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                <select
                  value={requestData.urgency}
                  onChange={(e) => setRequestData({...requestData, urgency: e.target.value})}
                  className="input-field"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <input
                type="text"
                required
                value={requestData.hospital}
                onChange={(e) => setRequestData({...requestData, hospital: e.target.value})}
                className="input-field"
                placeholder="e.g., Apollo Hospital"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital City</label>
              <input
                type="text"
                required
                value={requestData.city}
                onChange={(e) => setRequestData({...requestData, city: e.target.value})}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message (Optional)</label>
              <textarea
                rows="3"
                value={requestData.message}
                onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                className="input-field resize-none"
                placeholder="Any specific instructions or details..."
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary"
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
