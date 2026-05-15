const express = require('express');
const router = express.Router();
const { getStats, getUsers, toggleBlockUser, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Apply middleware to all routes in this file
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
