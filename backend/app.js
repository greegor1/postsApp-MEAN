const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postsRoutes = require('./routes/posts')

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
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postsRoutes)

module.exports = app;

//mongo db greegor pw: LEZeJPu75PVg6OSK