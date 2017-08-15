var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Middleware. Use body-parser
app.use(bodyParser.json());




/**
 * Root Endpoint
 */

app.get('/', function (req, res) {
    now = new Date();
    dateString = now.toString();

    message = {
        app_id: "c9ab32dd-08c6-463e-98f9-4d61f6cd96e2",
        headings: {"en": "CEX.IO Alert"},
        contents: {"en": dateString},
        included_segments: ["All"]
    };

    res.send('This is RESTFul API for Tortoise Project');

    refreshIntervalId = setInterval(function(message) {
        sendNotification(message);
    }, 10000);
    // sendNotification(message);
});

app.get('/stop', function (req, res) {
    /* later */
    clearInterval(refreshIntervalId);
    res.send('Stopping service');
});

var sendNotification = function(data, input) {
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
    
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
};

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});