const User = require('../models/User');

// @desc    Search for donors
// @route   GET /api/donors/search
// @access  Private (Recipients/Admins)
const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    
    let query = { role: 'donor', available: true, isBlocked: false };
    
    if (bloodGroup) {
      // Decode URL encoded plus signs if any, but Express usually handles this
      query.bloodGroup = bloodGroup.replace(' ', '+'); 
    }
    
    if (city) {
      query.city = { $regex: city, $options: 'i' }; // Case-insensitive
    }

    const donors = await User.find(query).select('-password');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update donor availability
// @route   PUT /api/donors/availability
// @access  Private (Donor only)
const updateAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user && user.role === 'donor') {
      user.available = req.body.available !== undefined ? req.body.available : !user.available;
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        available: updatedUser.available
      });
    } else {
      res.status(404).json({ message: 'Donor not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update donor profile
// @route   PUT /api/donors/profile
// @access  Private (Donor only)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.city = req.body.city || user.city;
      user.address = req.body.address || user.address;
      
      if (user.role === 'donor') {
        user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchDonors, updateAvailability, updateProfile };
