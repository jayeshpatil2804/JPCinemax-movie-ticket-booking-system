const Show = require('../models/Show');

// Get all shows (with optional filtering)
exports.getShows = async (req, res) => {
    try {
        const { date, movie, cinema } = req.query;
        let query = {};
        if (date) {
            // Simple date match - might need range for real apps
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.startTime = { $gte: start, $lte: end };
        }
        if (movie) query.movie = movie;
        if (cinema) query.cinema = cinema;

        const shows = await Show.find(query).populate('movie').populate('cinema');
        res.json(shows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single show by ID
exports.getShowById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate('movie').populate('cinema');
        if (!show) return res.status(404).json({ message: 'Show not found' });
        res.json(show);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a show (Admin only)
exports.createShow = async (req, res) => {
    const show = new Show(req.body);
    try {
        const newShow = await show.save();
        res.status(201).json(newShow);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a show (Admin only)
exports.deleteShow = async (req, res) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id);
        if (!show) return res.status(404).json({ message: 'Show not found' });
        res.json({ message: 'Show deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
