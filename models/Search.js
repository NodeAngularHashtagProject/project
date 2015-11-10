var mongoose = require('mongoose');

var searchSchema = new mongoose.Schema({
    txt: String,
    count: Number,
    time: Array
});

module.exports = mongoose.model('Search',searchSchema);