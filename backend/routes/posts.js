const express = require("express");

const Post = require('../models/post')

const router = express.Router();

router.post('', (req, res, next) => {
    //const post = req.body; //this is a new field added by body parser
    // post model created with mongoose will actually be the bridge between nodejs and mongoDB
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

router.get('',  (req, res, next) => {
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

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: 'Post not found!'})
        }
    })
})

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.params.id,   //reusing existing id to not try to mute immutable id from DB
        title: req.body.title,
        content: req.body.content,
    })
    Post.updateOne({ _id: req.params.id }, post)  //accessing Post model created with using moongose so we can use updateOne() method provided
        .then(result => {
            res.status(200).json({message: 'Update successful!'})
        })
})

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            res.status(200).json({message: 'Post deleted!'})
        })
})

module.exports = router;