const User = require('../models/User');
const Booking = require('../models/Booking');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update user details (Role / Status)
exports.updateUser = async (req, res) => {
    try {
        const { role, isBlocked } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { role, isBlocked } },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Block/Unblock User
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: user.isBlocked ? 'User Blocked' : 'User Activated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get User Booking History
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.id })
            .populate({
                path: 'show',
                populate: { path: 'movie cinema' }
            })
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
