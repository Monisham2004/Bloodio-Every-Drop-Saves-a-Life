const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, sendOtp, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
