const mongoose = require('mongoose');

const donationHistorySchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
  date: { type: Date, default: Date.now },
  hospital: { type: String, required: true },
  units: { type: Number, required: true },
}, { timestamps: true });

const DonationHistory = mongoose.model('DonationHistory', donationHistorySchema);
module.exports = DonationHistory;
