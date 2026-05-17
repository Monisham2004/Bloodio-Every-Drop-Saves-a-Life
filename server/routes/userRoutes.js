const express = require('express');
const router = express.Router();
const { searchDonors, updateAvailability, updateProfile, getBloodGroupStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/stats', protect, getBloodGroupStats);
router.get('/search', protect, searchDonors);
router.put('/availability', protect, updateAvailability);
router.put('/profile', protect, updateProfile);

// Explicit donor search route requested by user
router.get('/search-donors/:bloodGroup', protect, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    // URL decoding might be necessary depending on how frontend sends it, but express usually handles it.
    // If it's sent as A+, express params will be A+. 
    // However if it's sent as A+ literally in URL, it might be A+.
    let bg = req.params.bloodGroup;
    if (bg.includes(' ')) {
      bg = bg.replace(' ', '+');
    }

    const donors = await User.find({
      bloodGroup: bg,
      _id: { $ne: currentUserId }
    });
    
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching donors'
    });
  }
});

module.exports = router;
