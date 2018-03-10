const mongoose = require('mongoose');

// Riddle schema
var quoteSchema = mongoose.Schema({
    body: {
    type: String,
    required: true
  },
  user_added: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Quote', quoteSchema);
