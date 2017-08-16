var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.disable('etag');

// Middleware. Use body-parser
app.use(bodyParser.json());


/**
 * Root Endpoint
 */

var isRunning = false;
var refreshIntervalId;
var limit;

function getLimit() {
    return limit;
}

function setLimit(input) {
    limit = Number(input);
}

app.get('/', function(req, res) {
    res.send('LOL');
});

app.get('/setlimit/:_setprice', function (req, res) {
    res.send('This is RESTFul API for Tortoise Project');
    var setprice = req.params._setprice;

    setLimit(setprice);

    if (!isRunning) {
        refreshIntervalId = setInterval(doStuff, 10000);
        doStuff();
        isRunning = true;
    }
    // sendNotification(message);
});

app.get('/stop', function (req, res) {
    res.send('Stopping service');
    clearInterval(refreshIntervalId);
    isRunning = false;
});

app.get('/ping', function (req, res) {
    res.send('Ping Successful!');
});

function doStuff() {
    pingHeroku();
    getPrice(function(result) {
        console.log('RESULT:', result);
        processThings(result);
    });
}

function processThings(input) {
    var apiData = JSON.parse(input);
    console.log('apiData:', apiData);

    var priceLimit = getLimit();
    var currentPrice = Number(apiData.lprice);

    if (priceLimit > currentPrice) {
        console.log('SETPRICE IS LOWER:');
        console.log('PRICE FROM CEX.IO:', currentPrice);

        var now = new Date();
        var dateString = now.toLocaleString('en-MY', { hour: 'numeric',minute:'numeric', hour12: true, timeZone: 'Asia/Kuala_Lumpur' });
        var messageString = dateString + '  Bitcoin price is low: USD' + currentPrice;
        var message = {
            app_id: "c9ab32dd-08c6-463e-98f9-4d61f6cd96e2",
            headings: {"en": "CEX.IO Alert"},
            contents: {"en": messageString},
            included_segments: ["All"]
        };

        sendNotification(message);
    } else {
        console.log('PRICE IS HIGHER:', currentPrice);
    }
}

var pingHeroku = function() {
    var options = {
        host: 'cexioalert.herokuapp.com',
        port: 443,
        path: '/ping',
        method: 'GET'

    };

    var body = "--START--";

    var req = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        res.on('data', function (chunk) {
            // body += chunk;
            // callback(chunk);
            console.log('PING:', chunk);
        });

        res.on('close', function () {
            console.log("\n\nClose received!");
        });

    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();

    return body + '... received';
};

var getPrice = function (callback) {
    var options = {
        host: 'cex.io',
        port: 443,
        path: '/api/last_price/BTC/USD',
        method: 'GET'

    };

    var body = "--START--";

    var req = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        res.on('data', function (chunk) {
            body += chunk;
            callback(chunk);
        });

        res.on('close', function () {
            console.log("\n\nClose received!");
        });

    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();

    return body + '... received';
};

function sendNotification(data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic ZjExZGRjYmQtOWIwOC00MTE2LWFmNDQtNGI4MGExZTUwYWJm"
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var req = https.request(options, function (res) {
        res.on('data', function (data) {
            console.log("Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
};

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});