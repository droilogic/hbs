const mongoose = require('mongoose');

const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

const bookingSchema = mongoose.Schema({
	// don't include id, we will go along with mongoDB's _id
	rv: { type: Number, required: true },	// row version (used for tracking update conflicts)
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
	guest_name: { type: String, required: true },
	guest_email: { type: String, required: true },
	guest_address: { type: String, default: ''},
	guest_phone: { type: String, required: true },
  room: { type: String, required: true },
  persons: { type: Number, required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  price: { type: Number, required: true },
	comments: { type: String, default: '' }
}, opts);

module.exports = mongoose.model('Booking', bookingSchema);
