var express = require('express');
var router = express.Router();
var needle = require('needle');
var Twitter = require('twitter');
var env = require('node-env-file');
var fs = require('fs');
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var Trends = require('../models/Trends.js');

env('config/.twitterenv');

// Create Base64 Object
var yahooID = process.env.YAHOO_ID;
var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

new CronJob('0 2 * * *', function () {
    console.log("Running twitter cron job.");
    fs.readFile('config/twitter_countries.json', 'utf8', function (err, countries) {
        if (err) {
            console.log("failed to read twitter_countries.json")
        }
        else {
            countries = JSON.parse(countries);
            // console.log("countries: " + countries);
            // console.log(countries.length);
            //res.json(countries);
            Trends.remove({}, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    trendsUpdater(0, countries);
                    console.log("Twitter cron job stopped running.");
                }
            });

        }
    });
}, null, true, 'Europe/Copenhagen');

router.route('/api/twitter/tag/:tagname').get(function (req, res) {
    client.get('search/tweets', {q: req.params.tagname}, function (error, tweets, response) {
        res.json(tweets);
    });
});

router.route('/api/twitter/trends/location/:country').get(function (req, res) {
    Trends.find({country: req.params.country}, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result.trends);
        }
    });
});

var trendsUpdater = function (i, countries) {
    console.log("c in cronjobtest: " + countries[i].country);
    needle.get('http://where.yahooapis.com/v1/places.q(' + countries[i].country + ');start=0;count=1?format=json&appid=' + yahooID,
        function (err, response) {
            if (response.body.places.total === 0) {
                // error handling
                //res.json({msg : "could not get woeid for " + c.country})
            }
            else {
                woeid = Number(response.body.places.place[0]["country attrs"].woeid);

                client.get('trends/place', {id: woeid}, function (error, trends, response) {
                        if (error) {
                            console.log("Aborting twitter cron job. There was an error calling the twitter api.")
                        }
                        else {
                            var data = {};
                            data.country = countries[i].country;
                            data.woeid = woeid;
                            data.trends = trends[0].trends;
                            Trends.create(data, function (err, post) {
                                if (err) {

                                    console.log("Twitter cron job failed to save to db.")
                                }
                                else {
                                    console.log("Saved trends from " + data.country + " to db.");
                                    i++;
                                    if (i < countries.length) {
                                        trendsUpdater(i, countries);
                                    }
                                }
                            });
                        }
                    }
                );
            }
        });
};

module.exports = router;