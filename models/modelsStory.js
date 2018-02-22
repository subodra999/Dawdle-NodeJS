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
  }
});

module.exports = mongoose.model('Story', storySchema);