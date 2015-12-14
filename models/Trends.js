/*
 * Written by Mads
 * */

var mongoose = require('mongoose');

var trendsSchema = new mongoose.Schema({
    country: String,
    woeid: Number,
    trends: Array
});

module.exports = mongoose.model('Trends',trendsSchema);