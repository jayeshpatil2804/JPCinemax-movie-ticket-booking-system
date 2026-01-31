const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, toggleBlockUser, getUserBookings } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All routes here are Admin protected
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.patch('/:id/block', toggleBlockUser);
router.get('/:id/bookings', getUserBookings);

module.exports = router;
