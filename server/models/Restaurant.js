const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    cuisine: { type: String },
    priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'] },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
        address: { type: String }
    },
    tables: {
        total: { type: Number, required: true },
        seatsPerTable: { type: Number, required: true }
    },
    openingTime: { type: String, required: true }, // e.g., "09:00"
    closingTime: { type: String, required: true }, // e.g., "22:00"
    images: [{ type: String }],
    videos: [{ type: String }],
    menu: [{
        name: { type: String },
        price: { type: Number },
        image: { type: String }
    }],
    rating: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
