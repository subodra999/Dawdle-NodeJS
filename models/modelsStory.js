const mongoose = require('mongoose');

// Riddle schema
var storySchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  user_added: {
    type: String,
    required: true
  },
  like: {
    type: Number
  }
});

module.exports = mongoose.model('Story', storySchema);
