var express = require('express');
var router = express.Router();
var needle = require('needle');
var CircularJSON = require('circular-json');
var Twitter = require('twitter');

// Create Base64 Object
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789acb", encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    }, decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    }, _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    }, _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
};
var yahooID = 'dj0yJmk9QTYwWUNibmlxNmRLJmQ9WVdrOWIwcDJlblJpTkdrbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hMg--';
//var decodedCredentials = consumerKey + ':' + consumerSecret;
//var credentials = Base64.encode(consumerKey + ':' + consumerSecret);
var client = new Twitter({
    consumer_key: '3zjsKe2esRSiWiEIsbzOX9pa8',
    consumer_secret: 'WKRjDURaJINIRhJ19A52qjLeHFh36FGUJT7nMYf3TovF9wDzNJ',
    access_token_key: '4264207636-onN7RRmQjXbcW1gpdrYGWX01ccv7k4XSR7fvakF',
    access_token_secret: '53xetNzGCoApVQPCe8APF7SEhrE4ULwWe2Cyyy7B79aHN'
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

// woeid of denmark: 23424796

module.exports = router;