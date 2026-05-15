const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  hospital: { type: String, required: true },
  city: { type: String, required: true },
  urgency: { 
    type: String, 
    enum: ['Normal', 'Urgent', 'Critical'], 
    default: 'Normal' 
  },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], 
    default: 'Pending' 
  },
}, { timestamps: true });

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
module.exports = BloodRequest;
