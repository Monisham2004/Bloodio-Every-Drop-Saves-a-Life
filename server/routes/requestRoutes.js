const express = require('express');
const router = express.Router();
const { createRequest, createBulkRequest, getMyRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, createRequest);
router.post('/bulk', protect, createBulkRequest);
router.get('/my', protect, getMyRequests);
router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;
