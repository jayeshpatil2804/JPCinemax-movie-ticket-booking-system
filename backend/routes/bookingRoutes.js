const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Protected routes
router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getMyBookings);

// Admin route
router.get('/', [authMiddleware, adminMiddleware], getAllBookings);

module.exports = router;
