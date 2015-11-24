var express = require('express');
var router = express.Router();
var needle = require('needle');
var Twitter = require('twitter');
var env = require('node-env-file');

env( './../config/.twitterenv');

// Create Base64 Object
var yahooID = process.env.YAHOO_ID;
var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

router.route('/api/twitter/tag/:tagname').get(function (req, res) {
    client.get('search/tweets', {q: req.params.tagname}, function (error, tweets, response) {
        console.log(tweets);
        res.json(tweets);
    });
});

router.route('/api/twitter/trends/location/:placename').get(function (req, res) {
    needle.get('http://where.yahooapis.com/v1/places.q(' + req.params.placename + ');start=0;count=1?format=json&appid=' + yahooID,
        function (err, response) {
            woeid = Number(response.body.places.place[0]["country attrs"].woeid);

            client.get('trends/place', {id: woeid}, function (error, trends, response) {
                res.json(trends);
            });
        });
});

module.exports = router;