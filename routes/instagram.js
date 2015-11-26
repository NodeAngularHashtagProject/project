var express = require('express');
var router = express.Router();
var needle = require('needle');
var env = require('node-env-file');
var instagram = require('instagram');

env('config/.instagramenv');

router.route('/api/instagram/tag/:tagname/:count').get(function (req, res){
    needle.get('https://api.instagram.com/v1/tags/' + req.params.tagname + '/media/recent?client_id=' +
    process.env.CLIENT_ID + '&count=' + req.params.count, function(err, response) {
        res.json(response.body.data);
    })
});

router.route('')

module.exports = router;