const mongoose = require('mongoose');

const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

const employeeSchema = mongoose.Schema({
	// don't include id, we will go along with mongoDB's _id
	rv: { type: Number, required: true },	// row version (used for tracking update conflicts)
	name: { type: String, required: true},
	email: { type: String, required: true},
	address: { type: String, default: ''},
	phone: { type: String, default: ''},
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	comments: { type: String, default: ''}
}, opts);

module.exports = mongoose.model('Employee', employeeSchema);
