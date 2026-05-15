const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const DonationHistory = require('../models/DonationHistory');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalRecipients = await User.countDocuments({ role: 'recipient' });
    const totalRequests = await BloodRequest.countDocuments();
    const completedDonations = await BloodRequest.countDocuments({ status: 'Completed' });
    const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });

    // Most requested blood group aggregation
    const popularGroupResult = await BloodRequest.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const mostRequestedBloodGroup = popularGroupResult.length > 0 ? popularGroupResult[0]._id : 'N/A';

    res.json({
      totalDonors,
      totalRecipients,
      totalRequests,
      completedDonations,
      pendingRequests,
      mostRequestedBloodGroup
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block or unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin only)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getUsers, toggleBlockUser, deleteUser };
