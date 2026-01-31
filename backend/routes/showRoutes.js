const express = require('express');
const router = express.Router();
const { getShows, getShowById, createShow, deleteShow } = require('../controllers/showController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.get('/', getShows);
router.get('/:id', getShowById);

// Admin
router.post('/', [authMiddleware, adminMiddleware], createShow);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteShow);

module.exports = router;
