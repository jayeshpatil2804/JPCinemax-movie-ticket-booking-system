const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalMovies = await Movie.countDocuments();
        const totalCinemas = await Cinema.countDocuments();
        const totalShows = await Show.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();

        // Calculate Revenue (simple sum of all booking totals)
        const revenueAggregation = await Booking.aggregate([
            { $match: { paymentStatus: 'SUCCESS' } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

        // Recent Bookings
        const recentBookings = await Booking.find()
            .sort({ bookingDate: -1 })
            .limit(5)
            .populate('user', 'name')
            .populate({
                path: 'show',
                populate: { path: 'movie cinema' }
            });

        res.json({
            stats: {
                totalMovies,
                totalCinemas,
                totalShows,
                totalBookings,
                totalUsers,
                totalRevenue
            },
            recentBookings
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
