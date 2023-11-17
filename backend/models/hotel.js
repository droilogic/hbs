const mongoose = require('mongoose');
// const timeZone = require('mongoose-timezone');

const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

const hotelSchema = mongoose.Schema({
	// don't include id, we will go along with mongoDB's _id
	rv: { type: Number, required: true },	// row version (used for tracking update conflicts)
	name: { type: String, required: true},
	img: { type: String, required: true },
	email: { type: String, required: true},
	address: { type: String, default: ''},
	phone: { type: String, default: ''},
  rooms: { type: Number, required: true },
	// owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: false},
	comments: { type: String, default: ''}
}, opts);

module.exports = mongoose.model('Hotel', hotelSchema);
