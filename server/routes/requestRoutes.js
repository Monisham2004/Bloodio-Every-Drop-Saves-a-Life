const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('recipient'), createRequest);
router.get('/my', protect, getMyRequests);
router.put('/:id/status', protect, authorizeRoles('donor', 'admin'), updateRequestStatus);

module.exports = router;
