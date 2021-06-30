const HttpError = require("../models/http-error");
const Place = require('../models/place')
const User = require('../models/user')
const mongoose = require('mongoose');
const { validationResult } = require("express-validator");

const getCoordinates = require("../util/location");

const uuid = require("uuid").v4;
const mongooseUniqueValidator = require("mongoose-unique-validator");

const getPlaceById = async (req, res, next) => {
  console.log("GET REQUEST");
  const pid = req.params.pid;
 

  let place;
  try{
  place = await Place.findById(pid);}
  catch(error){
    // res.json(error);
    return next(new HttpError("Could not find place by id",500));
  }

  if (!place) {
      return next(new HttpError("Could not find place", 404));
  }




  

  res.json({ place: place.toObject({getters: true}) });
};

const getPlacesByUserId = async (req, res, next) => {
  const uid = req.params.uid;

  let places;

  try{
     places = await Place.find({creator: uid});
  }catch(error){
    return next(new HttpError("Failed to find by user", 500));
  }
  console.log(typeof places);
  console.log(places);
  res.json({ places: places.map(p => p.toObject({getters: true})) });
};

const createPlace = async (req, res, next) => {
  console.log("a")
  const error = validationResult(req);
  console.log(typeof error);
  if (!error.isEmpty()) {
    console.log(error);
    next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description, address } = req.body;
  
  let coordinates;
  try {
     coordinates = await getCoordinates(address);
  } catch (error) {
    return next(error);
  }
  let createdPlace;
  console.log(req.file.path)
  createdPlace = new Place({
    title,
    description,
    address,
    image : req.file.path,
    location: coordinates,
    creator : req.userData.id,
  });

  let user;

  try{
    user = await User.findById(createdPlace.creator);
  } catch(error){
    console.log("111")
    return next(error);
  }

  if(!user){
    return next(new HttpError("Creator not found" , 500));
  }




  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({session : sess});
    
    user.places.push(createdPlace);
    await user.save({session : sess});

    await sess.commitTransaction();
    

    
  }
  catch(error){
    console.log("222")
    return next(error);
  }

 

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const pid = req.params.pid;
  const { title, description } = req.body;

  const error = validationResult(req);
  console.log(typeof error);
  if (!error.isEmpty()) {
    console.log(error);
    return next (new HttpError("Invalid inputs passed, please check your data", 422));
  }
  
  let place;
  try{
  place = await Place.findById(pid);}
  catch(error){
    // res.json(error);
    return next(new HttpError("Could not find place by id",500));
  }

  if (!place) {
      return next(new HttpError("Could not find place", 404));
  }
  console.log(place.creator , req.userData.id)
  if(place.creator.toString() !== req.userData.id){
    return next(new HttpError("You are not allowed" , 401));
  }

  
  place.title = title;
  place.description = description;

  try{
    await place.save();
  }catch(error){
    
    return next(new HttpError("Could not save place" , 500));
  }
  
  res.status(200).json({ place: place.toObject({getters: true}) });
};



const deletePlace = async (req, res, next) => {
  const pid = req.params.pid;
  console.log("!sw")
  let place;
  try{
  place = await Place.findById(pid);}
  catch(error){
    // res.json(error);
    console.log(error);
    return next(new HttpError("Could not find place by id",500));
  }
  console.log("!sw")
  if (!place) {
      return next(new HttpError("Could not find place", 404));
  }

  let user;

  try{
    user = await User.findById(place.creator);
  }catch(error){
  
    return next(error);
  }

  if(place.creator.toString() !== req.userData.id){
    return next(new HttpError("You are not allowed" , 401));
  }

  
  console.log(user.id);

  try{
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    user.places.pull(place);
    await user.save({session : sess});
    await place.remove({session: sess});
    await sess.commitTransaction();
  }
  catch(error){
    
    return next(new HttpError("Transaction failed" , 500));
  }

  
  res.status(200).json({message: "Successfully deleted"});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
