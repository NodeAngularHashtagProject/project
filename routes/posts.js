var express = require('express');
var router = express.Router();
var needle = require('needle');
var Twitter = require('twitter');
var env = require('node-env-file');
var mongoose = require('mongoose');


env('config/.twitterenv');
env('config/.instagramenv');

// Setting up environmental variables
var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

/* Method for retrieving posts from twitter and instagram as uniform objects.
 * PRE: a tag to search for has been provided in url call to API method.
 * POST: returns a JSON array containing twitter and instagram posts
 *
 * Written by Kenneth & Mads
 * */

router.route('/api/posts/:tag').get(function (req, res) {
    getTwitterByTag(req.params.tag, function(err, tweets) {
        if(err){
            console.log(err);
        }
        else {
            var tweetsArr = tweets.statuses; // tweets have been found and put into tweetsArr
            getInstagramByTag(req.params.tag, 20, function(err, posts){
                if(err) {
                    console.log(err);
                }
                else {
                    var instaArr = posts; // posts have been found and put into instaArr
                    var result = [];
                    var length = (instaArr.length > tweetsArr.length) ? instaArr.length : tweetsArr.length;
                    // Loops through all objects in the two arrays, to create new uniform objects for front-end to handle
                    for(i = 0; i < length; i++){
                        if(i < tweetsArr.length){
                            var twMediaUrl;
                            if(tweetsArr[i].entities.media){ twMediaUrl = tweetsArr[i].entities.media[0].media_url; }
                            else { twMediaUrl = null; }
                            tweetObj = {
                                source : "twitter",
                                link : 'https://twitter.com/' + tweetsArr[i].user.screen_name + '/status/' + tweetsArr[i].id_str,
                                mediaurl : twMediaUrl,
                                text :  tweetsArr[i].text,
                                username : tweetsArr[i].user.screen_name,
                                likes : tweetsArr[i].favorite_count
                            };
                            result.push(tweetObj);
                        }
                        if(i < instaArr.length){
                            instaObj = {
                                source : "instagram",
                                link : instaArr[i].link,
                                mediaurl : instaArr[i].images.standard_resolution.url,
                                //text : instaArr[i].caption.text,
                                username : instaArr[i].user.username,
                                likes : instaArr[i].likes.count
                            };
                            if(instaArr[i].caption.text != null){
                                instaObj.text = instaArr[i].caption.text;
                            }
                            else{
                                instaObj.text = null;
                            }
                            result.push(instaObj);
                        }
                    }
                    res.json(result);
                }
            });
        }
    });
});
/* Method for retrieving tweets from twitters API, and use callback function when completed
 * PRE: valid tag parameter supplied
 * POST: Tweets found, callback method can react.
 *
 * Written by Mads
 * */
var getTwitterByTag = function (tag, callback) {
    client.get('search/tweets', {q: encodeURIComponent(tag)}, function (error, tweets, response) {
        if(error){
            process.nextTick(function(){
                callback(error, null);
            });
        }
        else {
            process.nextTick(function(){
                callback(null, tweets);
            });
        }
    });
};
/* Method for retrieving instagram posts from API, and use callback function when completed
 * PRE: valid tag parameter supplied
 * POST: Posts found, callback method can react.
 *
 * Written by Mads
 * */
var getInstagramByTag = function (tag, count, callback) {
    tag = tag.replace(/\s+/g, ''); // regex!
    needle.get('https://api.instagram.com/v1/tags/' + encodeURIComponent(tag) + '/media/recent?client_id=' +
        process.env.CLIENT_ID + '&count=' + count, function (err, response) {
        if(err) {
            process.nextTick(function(){
                callback(err, null);
            });
        }
        else {
            process.nextTick(function(){
                callback(null, response.body.data);
            });
        }
    })
};

module.exports = router;