const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g., "19:00"
    numberOfGuests: { type: Number, required: true },
    specialRequest: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
