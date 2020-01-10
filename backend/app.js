const path = require('path')                         // alows us to construct paths in a way that's safe to run on any operating system and is constructed correctly
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://gregor:LEZeJPu75PVg6OSK@cluster0-zms7w.mongodb.net/node-angular')  //Promise
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection filed!');
    })

app.use(bodyParser.json()); //this will return a valid express middleware for parsing json data
app.use(bodyParser.urlencoded({ extended: false })); //just an extra line we dont need here to show body parser is capable of parsing diffrent kinds of bodies.
app.use('/images', express.static(path.join("backend/images")))       // means that any req targeting /images will be allowed to continue and fetch their files from there. This is to make sure that reqs going to images are actually forwarded to BE images

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postsRoutes)
app.use("/api/user", userRoutes)

module.exports = app;

//mongo db greegor pw: LEZeJPu75PVg6OSK