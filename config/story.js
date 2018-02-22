const mongoose = require('mongoose');

var Story = require('../models/modelsStory.js');

// Get stories
module.exports.getStories = function(callback, limit){
  Story.find(callback).limit(limit);
}

// Add story
module.exports.addStory = function(story, callback){
  Story.create(story, callback);
}
