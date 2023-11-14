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
	description: { type: String, required: true},
  level: { type: Number, required: true}  // access level (0: highest, 100: lowest)
}, opts);

module.exports = mongoose.model('User', managerSchema);
