var mongoose = require('mongoose');

// Idea Schema
var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var User = module.exports = mongoose.model('User', userSchema);

// Get Users
module.exports.getUsers = function(callback, limit) {
    User.find(callback).limit(limit);
};

// Get Single User by ID
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

// Add a user
module.exports.addUser = function(user, callback) {
    User.create(user, callback);
};