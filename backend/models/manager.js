const mongoose = require('mongoose');

const managerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.UUID ,
	name: { type: String, required: true},
	email: { type: String, required: true},
	address: { type: String, default: ''},
	phone: { type: String, default: ''},
	comments: { type: String, default: ''}
});

module.exports = mongoose.model('Manager', managerSchema);
