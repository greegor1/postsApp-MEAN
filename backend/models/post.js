const mongoose = require('mongoose');

const postSchema = mongoose.Schema({                          // setting just a blueprint of the model
    title: { type: String, require: true },
    content: { type: String, require: true }
});

module.exports = mongoose.model('Post', postSchema);  //what this model method gives us is a constructor function