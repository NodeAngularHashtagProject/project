var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var needle = require('needle');
var env = require('node-env-file');
var fs = require('fs');
var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var Trends = require('../models/Trends.js');

env('config/.twitterenv');

// Setting up environmental variables
var yahooID = process.env.YAHOO_ID;
var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

/* Returns trends for specific country from database. Buggy! Crashes if result array is empty.
 * PRE: country parameter exists in db.
 * POST: array of trends for country returned to front-end
 * */
router.route('/api/twitter/trends/location/:country').get(function (req, res) {
    Trends.find({country: req.params.country}, function (err, result) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(result[0].trends);
        }
    });
});
/* Returns trends for all countries on the database.
 * POST: array of countries containing trends is returned.
 * */
router.route('/api/twitter/trends/').get(function (req, res) {
    Trends.find( function (err, result) {
        if(err){
            res.json(err);
        }
        else {
            res.json(result);
        }
    });
});

router.route('/api/cronjobtest/').get(function (req, res) {
    fs.readFile('config/twitter_countries.json', 'utf8', function (err, countries) {
        if (err) {
            console.log("failed to read twitter_countries.json")
        }
        else {
            countries = JSON.parse(countries);
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
});

/* Cronjob that runs every night at 02:00, updates the trends for all countries in database
 * by finding WOEID (from yahoo) for countries in config list, and finds trending topics on twitter
 * through the twitter API.
 * */
new CronJob('00 2 * * *', function () {
    console.log("Running twitter cron job.");
    fs.readFile('config/twitter_countries.json', 'utf8', function (err, countries) {
        if (err) {
            console.log("failed to read twitter_countries.json")
        }
        else {
            countries = JSON.parse(countries);
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

/* Helper method for the cronjob. Does the actual work.. Maybe we should split it up in a method
 * finding woeid, another using twitter api etc.?
 * */
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