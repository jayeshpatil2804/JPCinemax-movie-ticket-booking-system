const express = require('express');
const router = express.Router();
const { getCinemas, getCinemaById, createCinema, updateCinema, deleteCinema } = require('../controllers/cinemaController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getCinemas);
router.get('/:id', getCinemaById);

// Admin protected routes
router.post('/', [authMiddleware, adminMiddleware], createCinema);
router.put('/:id', [authMiddleware, adminMiddleware], updateCinema);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteCinema);

module.exports = router;
