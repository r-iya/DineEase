const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');
const { sendSMS } = require('../services/smsService');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res) => {
    try {
        const { restaurantId, date, timeSlot, numberOfGuests, specialRequest } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Convert date string to Date object
        const bookingDate = new Date(date);
        bookingDate.setHours(0, 0, 0, 0);

        // Find all active bookings for this restaurant, date, and time slot
        const activeBookings = await Booking.find({
            restaurantId,
            date: bookingDate,
            timeSlot,
            status: { $ne: 'cancelled' }
        });

        // Calculate currently booked tables
        let bookedTables = 0;
        activeBookings.forEach(booking => {
            // Assuming each booking takes Math.ceil(guests / seatsPerTable) tables
            bookedTables += Math.ceil(booking.numberOfGuests / restaurant.tables.seatsPerTable);
        });

        const requestedTables = Math.ceil(numberOfGuests / restaurant.tables.seatsPerTable);

        if (bookedTables + requestedTables > restaurant.tables.total) {
            return res.status(400).json({ message: 'No tables available for this time slot' });
        }

        // Create booking
        const booking = new Booking({
            userId: req.user._id,
            restaurantId,
            date: bookingDate,
            timeSlot,
            numberOfGuests,
            specialRequest,
            status: 'confirmed'
        });

        const savedBooking = await booking.save();

        // Send SMS Notification (assuming User has a phone field or hardcode for trial)
        // NOTE: In Twilio Free Trial, you can only send to verified numbers.
        const messageBody = `Confirmed! Your table at ${restaurant.name} is booked for ${date} at ${timeSlot} for ${numberOfGuests} guests.`;
        // await sendSMS("+1234567890", messageBody); // Requires real number

        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('restaurantId', 'name images location');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get restaurant bookings (Owner)
// @route   GET /api/bookings/restaurant/:id
// @access  Private (Owner)
const getRestaurantBookings = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const bookings = await Booking.find({ restaurantId: req.params.id }).populate('userId', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'owner' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getRestaurantBookings,
    cancelBooking
};
