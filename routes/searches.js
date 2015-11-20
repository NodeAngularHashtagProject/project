var express = require('express');
var router = express.Router();

    var mongoose = require('mongoose');
    var Search = require('../models/Search.js');

router.route('/api/searches').get(function (req, res) {
    Search.find(function(err, searches) {
        if(err){
            // error handling
        }
        res.json(searches);
    });
}).post(function (req, res) {

    Search.count({txt: req.body.txt}, function (err, count){
        if(count>0){
            Search.findOneAndUpdate({txt : req.body.txt}, { $inc : { count : 1}, $push : { time : Date.now()} }, function (err, result) {
                res.send("Updated entry");
            });
        }
        else {
            var data = req.body;
            data.time = [];
            data.time[0] = Date.now();
            data.count = 1;

            Search.create(data, function (err, post) {
                if(err){
                    // error handling
                }
                res.json(post);
            })
        }}
    );

});




module.exports = router;