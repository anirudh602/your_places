const express = require("express");
const { check } = require("express-validator");

const Router = express.Router();
const placesController = require("../controller/places-controller");



const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')



Router.get("/:pid", placesController.getPlaceById);
Router.get("/user/:uid", placesController.getPlacesByUserId);

console.log("A2")

Router.use(checkAuth);


Router.post(
  "/",  fileUpload.single('image'),
  [
    check("title").trim().not().isEmpty(),
    check("description").trim().isLength({ min: 5 }),
    check("address").trim().not().isEmpty(),
  ],
  placesController.createPlace
);

Router.patch("/:pid", [
    check("title").trim().not().isEmpty(),
    check("description").trim().isLength({ min: 5 }),

],  placesController.updatePlace);
Router.delete("/:pid" , placesController.deletePlace);

module.exports = Router;
