const axios = require('axios');
const HttpError = require('../models/http-error');


const API_KEY = "AIzaSyCiASm4YJpq5rqq4yo6HJzfhPgHtIeMzm8";


 const getCoordinates = async (address) => {


    const addr = encodeURIComponent(address);
    console.log(addr);
    const response = await axios.get(` https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=${API_KEY}` ) 
  
    if(!response || response.status === 'ZERO_RESULTS'){
        throw new HttpError("Could not find address for the specified location", 422);
    }
    return {
        lat: 27.1751496 ,
        lng: 78.0399535
    }
    return response.data.results[0].geometry.location;


}

module.exports = getCoordinates;