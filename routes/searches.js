var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Search = require('../models/Search.js');

/* Returns all search words from the database
*
* Written by Kenneth
 * */
router.route('/api/searches').get(function (req, res) {
    Search.find(function(err, searches) {
        if(err){
            // error handling
        }
        res.json(searches);
    });
    /* Posts a new search word to the database, or if it already exists, increments search count of word by 1,
     * as well as adding a timestamp for the time of this search.
     *
     * Written by Kenneth
     * */
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

/* Returns the ten most searched words from database.
*
* Written by Mads
* */
router.route('/api/searches/alltime').get(function(req, res) {

    // queries all in Search. Sorts after count, and limits to ten first results.
    var q = Search.find( {} ).limit(10).sort( {'count' : -1} );

    q.exec(function(err, result) {
        res.json(result);
    })
});



module.exports = router;