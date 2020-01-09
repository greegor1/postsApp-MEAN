const express = require("express");
const multer = require("multer");

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({                              // configure the way how multer does store things
    destination: (req, file, callback) => {                      // function which will be exevuted whenever multer tries to save a file
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null
        }
        callback(error, "backend/images")
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext)
    }
})

router.post('', multer({storage: storage}).single("image"), (req, res, next) => {       //this means multer will now try to  extract a single file from the incomin req and will try to find it on an image property in the req body
    //const post = req.body; //this is a new field added by body parser
    // post model created with mongoose will actually be the bridge between nodejs and mongoDB
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    }); // post model is a constructor function and allows us to construct new js object
    post.save()  // save method i provided by mongoose package for every model created with it. 
                 //It will automaticaly create the right query for our db to insert a new entry with autoamtically generated ID into the DB
                 // the name of the collection will always be the plural form of my model name so if name is Post, my collection name will be posts
        .then(createdPost => {
            res.status(201).json({ 
                message: "Post sent successfully",
                post: {
                    ...createdPost,
                    id: createdPost._id,
                }
            })
        })
})

router.get('',  (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then(count => {

            res.status(200).json({                      // we must execute response code inside then because fetching that data is an asynchronous task
                                                        // if we execute that outside then JS will execute res code before then and we'll get 500
                message: 'Posts  fetched succesfully',
                posts: fetchedPosts,
                maxPosts: count
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

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,   //reusing existing id to not try to mute immutable id from DB
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
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