const Cinema = require('../models/Cinema');

// Get all cinemas
exports.getCinemas = async (req, res) => {
    try {
        const cinemas = await Cinema.find();
        res.json(cinemas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single cinema
exports.getCinemaById = async (req, res) => {
    try {
        const cinema = await Cinema.findById(req.params.id);
        if (!cinema) return res.status(404).json({ message: 'Cinema not found' });
        res.json(cinema);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create cinema (Admin only)
exports.createCinema = async (req, res) => {
    const cinema = new Cinema(req.body);
    try {
        const newCinema = await cinema.save();
        res.status(201).json(newCinema);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update cinema (Admin only)
exports.updateCinema = async (req, res) => {
    try {
        const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cinema) return res.status(404).json({ message: 'Cinema not found' });
        res.json(cinema);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete cinema (Admin only)
exports.deleteCinema = async (req, res) => {
    try {
        const cinema = await Cinema.findByIdAndDelete(req.params.id);
        if (!cinema) return res.status(404).json({ message: 'Cinema not found' });
        res.json({ message: 'Cinema deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
