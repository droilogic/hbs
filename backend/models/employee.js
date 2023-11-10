const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  // _id: Schema.Types.UUID,
	name: { type: String, required: true},
	email: { type: String, required: true},
	address: { type: String, default: ''},
	phone: { type: String, default: ''},
	// manager_id: { type: mongoose.Schema.Types.UUID, ref: 'Manager', required: true},
	comments: { type: String, default: ''}
});

module.exports = mongoose.model('Employee', employeeSchema);
