var express = require('express');
var router = express.Router();
var needle = require('needle');
var CircularJSON = require('circular-json')

var consumerKey = encodeURIComponent('Niev5NImTCoU2U7NQMVT30hfB');
var consumerSecret = encodeURIComponent('u6rUFXdPpbPqC5EiYKKsqLkTFDuqgZ6MOw61ZpKt8IocYyueKc');
var accessToken = encodeURIComponent('262547337-T1X2MUUXQuO24B2IWh7Vr0FAaUO7lVNKtAwPlNrs');
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
var credentials = Base64.encode(consumerKey + ':' + consumerSecret);
var authResponse;


router.route('/api/twitter').post(function (req, res) {
    needle.post(
        'https://api.twitter.com/oauth2/token'
        , "grant_type=client_credentials"
        , {
            headers: {
                'Authorization': 'Basic ' + credentials,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        },
        function (err, resp) {
            if (err) {
                console.log(err);
            }
            authResponse = resp;
            // Figure out how authResponse is structured, so that access token can be used in header in get calls;
            console.log(CircularJSON.stringify(authResponse));
            res.send('Authentication succesful');
        });

});

// all good, except header: https://dev.twitter.com/oauth/overview/authorizing-requests. Problem med nonce + signature?
router.route('/api/twitter/tag/:tagname').get(function (req, res) {
    needle.get('https://api.twitter.com/1.1/search/tweets.json?q=' + req.params.tagname,
        {
            headers: {
                'Authorization': 'OAuth ' + encodeURIComponent('oauth_consumer_key') + '= "' + consumerKey + '", ' +
                encodeURIComponent("oauth_nonce") + '= "' + encodeURIComponent(Base64.encode(Base64._keyStr)) + '", ' +
                encodeURIComponent('oauth_signature') + '= "' + encodeURIComponent(credentials) + '", ' +
                encodeURIComponent('oauth_signature_method') + '= "' + encodeURIComponent('HMAC-SHA1') + '", ' +
                encodeURIComponent('oauth_timestamp') + '= "' + encodeURIComponent(Date.now()) + '", ' +
                encodeURIComponent('oauth_token') + '= "' + accessToken + '", ' +
                encodeURIComponent('oauth_version') + '= "' + encodeURIComponent('1.0' + '"')
            }
        },
        function (err, resp) {

            console.log(resp.body);
            res.json(resp.body);
        })
});

module.exports = router;

//
//headers: {
//    'Authorization': 'OAuth ' + encodeURIComponent('oauth_consumer_key') + '= "' + consumerKey + '", ' +
//    encodeURIComponent("oauth_nonce") + '= "' + encodeURIComponent(Base64.encode(Base64._keyStr)) + '", ' +
//    encodeURIComponent('oauth_signature') + '= "' + encodeURIComponent(credentials) + '", ' +
//    encodeURIComponent('oauth_signature_method') + '= "' + encodeURIComponent('HMAC-SHA1') + '", ' +
//    encodeURIComponent('oauth_timestamp') + '= "' + encodeURIComponent(Date.now()) + '", ' +
//    encodeURIComponent('oauth_token') + '= "' + accessToken + '", ' +
//    encodeURIComponent('oauth_version') + '= "' + encodeURIComponent('1.0' + '"')