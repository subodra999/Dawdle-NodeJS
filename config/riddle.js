const mongoose = require('mongoose');

var Riddle = require('../models/modelsRiddle.js');

// Get riddles
module.exports.getRiddles = function(callback, limit){
  Riddle.find(callback).limit(limit);
}

// Add riddles
module.exports.addRiddle = function(riddle, callback){
  Riddle.create(riddle, callback);
}
