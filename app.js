var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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
    res.send('This is RESTFul API for Tortoise Project');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});