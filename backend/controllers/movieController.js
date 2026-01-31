const Movie = require('../models/Movie');

// Get all movies
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single movie
exports.getMovieById = async (req, res) => {
    try {
        let movie;
        const { id } = req.params;

        // Check if id is a valid ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            movie = await Movie.findById(id);
        }

        // If not found by ID or ID is not ObjectId, try by slug
        if (!movie) {
            movie = await Movie.findOne({ slug: id });
        }

        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create movie (Admin only)
exports.createMovie = async (req, res) => {
    const movie = new Movie(req.body);
    try {
        const newMovie = await movie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update movie (Admin only)
exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete movie (Admin only)
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
