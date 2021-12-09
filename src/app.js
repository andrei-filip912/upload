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


// app.get('/add-user', async (req, res) => {
//   movie = {
//     name: "ceva",
//     fileType: "video",
//     size: 5345,
//     url: "asdf",
//   }
//   try {
//     const user = await UserService.updateOrCreateUser('cibilan', movie);
//     res.json(user);

//   } catch (err) {
//     console.log(err);
//   }
// });

app.post("/upload", [jwtCheck, multerUploads], function (req, res) {
  //jwt decoding
  const token = jwt_decode(req.get('Authorization').split(' ')[1]);
  const user_id = token.sub;

  if (req.file) {
    const {originalname, mimetype, size} = req.file;

    const file = dataUri(req);
    cloudinary.config();
  
    return cloudinary.uploader
      .upload(file)
      .then((result) => {
        const image = result.url;

        const movie = {
          name: originalname,
          fileType: mimetype,
          size: size,
          url: result.url,
        }


        userService.updateOrCreateUser(user_id, movie);

        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).json({
          message: "Your image has been uploded successfully to cloudinary",
          data: {
            image,
          },
        });
      })
      .catch((err) =>{
        res.set("Access-Control-Allow-Origin", "*");
        res.status(400).json({
          message: "something went wrong while processing your request",
          data: {
            err,
          },
        });
      });
  }
});

module.exports = app;