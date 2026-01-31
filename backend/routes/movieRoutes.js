const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
// Public routes
console.log("Registering movie routes...");
router.get('/', (req, res, next) => {
    console.log("GET /api/movies hit");
    getMovies(req, res, next);
});
router.get('/:id', getMovieById);

// Admin protected routes
router.post('/', [authMiddleware, adminMiddleware], createMovie);
router.put('/:id', [authMiddleware, adminMiddleware], updateMovie);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteMovie);

module.exports = router;
