const User = require('../models/User');

// @desc    Search for donors
// @route   GET /api/donors/search
// @access  Private (Recipients/Admins)
const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    
    let query = { _id: { $ne: req.user._id }, available: true, isBlocked: false };
    
    if (bloodGroup) {
      query.bloodGroup = bloodGroup.replace(' ', '+'); 
    }
    
    if (city) {
      query.city = { $regex: city, $options: 'i' }; 
    }

    const users = await User.find(query).select('-password');
    
    console.log("Current User ID:", req.user._id);
    console.log("Search Blood Group:", req.query.bloodGroup);
    console.log("Found Donors Count:", users.length);
    
    res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blood group stats
// @route   GET /api/users/stats
// @access  Private
const getBloodGroupStats = async (req, res) => {
  try {
    const counts = await User.aggregate([
      {
        $match: {
          available: true,
          isBlocked: false,
          _id: { $ne: req.user._id }
        }
      },
      {
        $group: {
          _id: "$bloodGroup",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(counts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'Missing user ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { available: req.body.available },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("DB availability:", updatedUser.available);

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
       success: false,
       message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const user = await User.findById(req.user._id);

    if(!user){
       return res.status(404).json({
          success:false,
          message:"User not found"
       });
    }

    if(req.body.name) user.name = req.body.name;
    if(req.body.phone) user.phone = req.body.phone;
    if(req.body.city) user.city = req.body.city;
    if(req.body.address) user.address = req.body.address;
    if(req.body.bloodGroup) user.bloodGroup = req.body.bloodGroup;

    if(req.body.location){
       user.location = {
         lat:Number(req.body.location?.lat) || null,
         lng:Number(req.body.location?.lng) || null,
         areaName: req.body.location?.areaName || null
       };
    }

    if(req.body.password) {
      user.password = req.body.password;
    }

    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
       success:true,
       user
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:");
    console.error(error);
    return res.status(500).json({
       success:false,
       message:error.message,
       stack:error.stack
    });
  }
};

module.exports = { searchDonors, updateAvailability, updateProfile, getBloodGroupStats };
