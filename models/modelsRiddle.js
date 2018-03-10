const mongoose = require('mongoose');

// Riddle schema
var riddleSchema = mongoose.Schema({
    body: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  user_added: {
    type: String,
    required: true
  },
  like : {
    type: Number
  }
});

module.exports = mongoose.model('Riddle', riddleSchema);
