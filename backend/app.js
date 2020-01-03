const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Post = require('./models/post')

const app = express();

mongoose.connect('mongodb+srv://gregor:LEZeJPu75PVg6OSK@cluster0-zms7w.mongodb.net/node-angular?retryWrites=true&w=majority')  //Promise
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection filed!');
    })

app.use(bodyParser.json()); //this will return a valid express middleware for parsing json data
app.use(bodyParser.urlencoded({ extended: false })); //just an extra line we dont need here to show body parser is capable of parsing diffrent kinds of bodies.

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, DELETE, OPTIONS");
    next();
})

app.post('/api/posts', (req, res, next) => {
    //const post = req.body; //this is a new field added by body parser
    // post model created with mongoose will actually be the brodge between nodejs and mongoDB
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    }); // post model is a constructor function and allows us to construct new js object
    post.save()  // save method i provided by mongoose package for every model created with it. 
                 //It will automaticaly create the right query for our db to insert a new entry with autoamtically generated ID into the DB
                 // the name of the collection will always be the plural form of my model name so if name is Post, my collection name will be posts
        .then(createdPost => {
            res.status(201).json({ 
                message: "Post sent successfully",
                postId: createdPost._id
            })
        })
})

app.get('/api/posts',  (req, res, next) => {
    Post.find()     //will returnn all entries (like in the shell)
        .then(documents => {
            res.status(200).json({                      // we must execute response code inside then because fetching that data is an asynchronous task
                                                        // if we execute that outside then JS will execute res code before then and we'll get 500
                message: 'Posts  fetched succesfully',
                posts: documents
            });
        })          // we dont wanna use callback in find() because we can easly end up in callback hell, and that's why we chain a then block
                    // find doesn't return promise, but object which has a then block that behaves similarly
})

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({message: 'Post deleted!'})
        })
})

module.exports = app;

//mongo db greegor pw: LEZeJPu75PVg6OSK