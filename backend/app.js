const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path')

const app = express();

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes')
const HttpError = require("./models/http-error");

app.use(bodyParser.json())

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers' , 'Origin , X-Requested-With , Content-Type , Accept , Authorization');
    res.setHeader('Access-Control-Allow-Methods' , 'GET , POST , PATCH , DELETE');

    next();

})

app.use('/uploads/images' , express.static(path.join('uploads' , 'images')));

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);


app.use((req , res , next) => {
    const error = new HttpError("Could not find route" , 404);
    next(error);
})


app.use((error , req , res , next) => {

    if(req.file){
        fs.unlink(req.file.path , (error) => {
            console.log(error);
        });   
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "Unknown error occured"})
})

console.log(process.env.DB_USER)

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wcuaf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(url).then(() => app.listen(process.env.PORT || 5000)).catch(e => console.log(e));

