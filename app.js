var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Middleware. Use body-parser
app.use(bodyParser.json());

// Make User model available here
User = require('./models/user');

// Make Idea model available here
Idea = require('./models/idea');

// Connect to Mongoose
mongoose.connect('mongodb://localhost/tortoise');
var db = mongoose.connection;



/**
 * Root Endpoint
 */

app.get('/', function (req, res) {
    res.send('This is RESTFul API for Tortoise Project');
});



/**
 * Endpoint for Users
 */

app.get('/api/users', function(req, res) {
     User.getUsers(function(error, users) {
         if (error) {
             throw error;
         }

         res.json(users);
     });
});

app.get('/api/users/:_id', function(req, res) {
    User.getUserById(req.params._id, function(error, user) {
        if (error) {
            throw error;
        }

        res.json(user);
    });
});

app.post('/api/users', function(req, res) {
    var user = req.body;

    User.addUser(user, function(error, user) {
        if (error) {
            throw error;
        }

        res.json(user);
    });
});



/**
 * Endpoint for Ideas
 */

app.get('/api/ideas', function (req, res) {
    Idea.getIdeas(function(error, ideas) {
        if (error) {
            throw error;
        }

        res.json(ideas);
    });
});

app.get('/api/ideas/:_id', function (req, res) {
    Idea.getIdeaById(req.params._id, function(error, idea) {
        if (error) {
            throw error;
        }

        res.json(idea);
    });
});

app.post('/api/ideas', function(req, res) {
    var idea = req.body;

    Idea.addIdea(idea, function(error, idea) {
        if (error) {
            throw error;
        }

        res.json(idea);
    });
});


// Run express at port 3000
app.listen(3000);
console.log('Running on port 3000...');