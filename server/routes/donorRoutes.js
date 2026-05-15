const express = require('express');
const router = express.Router();
const { searchDonors, updateAvailability, updateProfile } = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/search', protect, authorizeRoles('recipient', 'admin'), searchDonors);
router.put('/availability', protect, authorizeRoles('donor'), updateAvailability);
router.put('/profile', protect, authorizeRoles('donor'), updateProfile);

module.exports = router;
