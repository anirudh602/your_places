const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const uuid = require("uuid").v4;
const User = require('../models/user');

const bcrypt = require('bcryptjs');


const getUsers = async(req, res, next) => {
    
    let result;

    try{
        result = await User.find({} , "-password").exec();
    }
    catch(error){
        return next(error);
        }

        
    res.json({users: result.map(r => r.toObject({getters: true}))});

}


const login = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next( new HttpError("Invalid credentials, please check them",422));
    }
    const {email, password} = req.body;

    let user;

    try{
        user = await User.findOne({email: email});
    }catch(error){
        return next(error);
    }
    console.log(user);
    if(!user){
       return  next (new HttpError("Could not find user, credentials are wrong" , 401));
    }

    let isValid = false;

    try{
        isValid = await bcrypt.compare(password, user.password);

    }catch(error){
        return next(new HttpError("Could not log you in" , 500));
    }

    if(!isValid){
        return  next (new HttpError("Could not find user, credentials are wrong" , 401));
    }

    let token;
    try{
        token = jwt.sign({id: user.id , email: user.email} , process.env.DB_KEY , {expiresIn : "1h"});
    } catch(error){

    }


    res.json({id : user.id , email : user.email , token : token}).status(200);



}

const signup = async (req, res, next) => {
    const error = validationResult(req);
   
    if(!error.isEmpty()){
        console.log(error)
        return next( new HttpError("Invalid credentials, please check them",422));


    }
    const {name, email, password} = req.body;
    console.log("img");
    let user;
    try{
      user = await User.findOne({email: email});
    }catch(error){
        return next(new HttpError("Something went wrong" , 500));
    }

    console.log(user)
    if(user){
        return next(new HttpError("This email id is already registered", 500));
    }

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password , 12);
    }catch(error){
        return next(error);
    }

    const newUser = new User({
      
        name,
        email,
        password : hashedPassword,
        image : req.file.path,
        places: []
    })

    try{
        await newUser.save();
    }catch(error){
        return next(new HttpError("Signing up failed" , 500));
    }

    let token;
    try{
        token =  jwt.sign({id : newUser.id , email : newUser.email} , process.env.DB_KEY , {expiresIn : "1h"});
    }catch(error){
        return next(new HttpError("Signing up failed" , 500));
    }

    res.json({id : newUser.id , email : newUser.email , token : token}).status(201);

}


exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
