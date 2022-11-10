require("dotenv").config(); 
const express = require("express");
const cloudinary = require("./config/cloudinaryConfig");
const { multerUploads, dataUri } = require("./middleware/multer");
const { jwtCheck } = require("./auth/checkJwt");
const jwt_decode = require("jwt-decode");
const cors = require("cors");
const mongoose = require("mongoose");
// const User_to_movie = require('./models/user_to_movie.model');
const userService = require('./user/services/user.service');


// create the app, set the port
const app = express();

// using middleware cors, json for body parsing and urlencoded
app.use(cors());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

function decodeJwt(encodedToken) {
  //jwt decoding
  const token = jwt_decode(encodedToken);
  return token.sub;
}

app.post("/upload", [jwtCheck, multerUploads], function (req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  
  if (req.file) {
    const file = dataUri(req);
    cloudinary.config();

    return cloudinary.uploader
      .upload(file, {resource_type: "video"})
      .then((result) => {
        // get user_id
        const user_id = decodeJwt(req.get('Authorization').split(' ')[1]);

        // get the props and create movie object
        const {originalname, mimetype, size} = req.file;
        const movie = {
          name: originalname,
          fileType: mimetype,
          size: size,
          url: result.url,
        }

        // save to database
        userService.updateOrCreateUser(user_id, movie);

        
        res.status(200).json({
          message: "Your video has been successfully uploaded!",
        });
      })
      .catch((err) =>{
          res.sendStatus(400);
      });
  }
});

app.get("/movies", [jwtCheck], async function(req, res) {
  // get user_id
  const user_id = decodeJwt(req.get('Authorization').split(' ')[1]);

  // get the list of movies
  userService.getUserMovies(user_id)
  .then(result  => {  
    res.set("Access-Control-Allow-Origin", "*");

    // result can be null if the user is not saved id db
    //  or [] if the user has no movies
    res.status(200).json({result});
  })
  .catch(err => {
    res.set("Access-Control-Allow-Origin", "*");
    res.status(400).json({
      message: "something went wrong while processing your request",
    });
  });
})

module.exports = app;