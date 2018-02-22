const mongoose = require('mongoose');

// Riddle schema
var riddleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Riddle', riddleSchema);