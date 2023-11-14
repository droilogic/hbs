const mongoose = require('mongoose');

const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

const managerSchema = mongoose.Schema({
	// don't include id, we will go along with mongoDB's _id
	rv: { type: Number, required: true},	// row version (used for tracking update conflicts)
	username: { type: String, required: true},
	password: { type: String, required: true},
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
	name: { type: String, required: true},
	email: { type: String, required: true},
	phone: { type: String, default: ''},
	comments: { type: String, default: ''}
}, opts);

module.exports = mongoose.model('User', managerSchema);
