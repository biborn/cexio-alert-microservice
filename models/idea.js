var mongoose = require('mongoose');

// Idea Schema
// TODO: Reconstruct schema to has better model
var ideaSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var Idea = module.exports = mongoose.model('Idea', ideaSchema);

// Get Ideas
module.exports.getIdeas = function(callback, limit) {
    Idea.find(callback).limit(limit);
};

// Get Single Idea by ID
module.exports.getIdeaById = function(id, callback) {
    Idea.findById(id, callback);
};

// Add an idea
module.exports.addIdea = function(idea, callback) {
    Idea.create(idea, callback);
};