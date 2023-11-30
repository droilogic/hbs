const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const opts = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

const userSchema = mongoose.Schema({
	// don't include id, we will go along with mongoDB's _id
	rv: { type: Number, required: true},	// row version (used for tracking update conflicts)
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true},
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
	name: { type: String, required: true},
	phone: { type: String, default: ''},
	comments: { type: String, default: ''}
}, opts);

// enable unique validator
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
