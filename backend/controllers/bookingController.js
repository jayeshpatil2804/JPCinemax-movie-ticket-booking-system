const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Create a booking
exports.createBooking = async (req, res) => {
    try {
        // user is from authMiddleware
        const { showId, seats, totalPrice } = req.body; // seats: [{row: 'A', number: 1, price: 100, type: 'GOLD'}]

        const show = await Show.findById(showId);
        if (!show) return res.status(404).json({ message: 'Show not found' });

        // Check if seats are already booked
        for (let seat of seats) {
            const existingSeat = show.seats.find(s => s.row === seat.row && s.number === seat.number);
            if (existingSeat && existingSeat.isBooked) {
                return res.status(400).json({ message: `Seat ${seat.row}${seat.number} is already booked` });
            }
        }

        // Update Show seats to booked
        seats.forEach(seat => {
            const existingSeatIndex = show.seats.findIndex(s => s.row === seat.row && s.number === seat.number);
            if (existingSeatIndex > -1) {
                show.seats[existingSeatIndex].isBooked = true;
                show.seats[existingSeatIndex].bookedBy = req.user.id;
            } else {
                show.seats.push({
                    row: seat.row,
                    number: seat.number,
                    price: seat.price,
                    type: seat.type || 'STANDARD',
                    isBooked: true,
                    bookedBy: req.user.id
                });
            }
        });

        await show.save();

        const bookingId = 'TIK-' + Math.floor(100000 + Math.random() * 900000); // TIK-123456

        const booking = new Booking({
            user: req.user.id,
            show: showId,
            seats,
            totalPrice,
            bookingId: bookingId,
            paymentStatus: 'SUCCESS', // We assume payment verified on frontend or separate endpoint in prod
            qrCode: bookingId // Simulating QR code data
        });

        const newBooking = await booking.save();

        // Populate the returned booking for UI
        await newBooking.populate({
            path: 'show',
            populate: { path: 'movie cinema' }
        });

        res.status(201).json(newBooking);

    } catch (err) {
        console.error("Booking Creation Error:", err);
        res.status(400).json({ message: err.message, detailed: err });
    }
};

// Get user bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate({
                path: 'show',
                populate: [
                    { path: 'movie', select: 'title posterUrl heroImageUrl duration language' },
                    { path: 'cinema', select: 'name location' }
                ]
            })
            .sort({ bookingDate: -1 }); // Newest first
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all bookings (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user').populate('show');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
