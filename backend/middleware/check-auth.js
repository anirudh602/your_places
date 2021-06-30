const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");


const check = (req, res, next) => {
    console.log("A!")
    if(req.method === 'OPTIONS') return next();

    try{
        console.log("HEADERS" , req.headers)
        token = req.headers.authorization.split(' ')[1];
      
        if(!token){
            throw new Error();
        }
        const decodedToken = jwt.verify(token , "very_secret_key");
        req.userData = {id: decodedToken.id}
        next();
    }
    catch(error){
        return next(new HttpError("Authorization failed!",401))
    }



}

module.exports = check;