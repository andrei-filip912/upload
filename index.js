require("dotenv").config();
const express = require("express");
const cloudinary = require("./config/cloudinaryConfig");
const { multerUploads, dataUri } = require("./middleware/multer");
const { jwtCheck } = require("./auth/checkJwt");
const jwt_decode = require("jwt-decode");
const cors = require("cors");
const mongoose = require('mongoose');


const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://vscodeUser:'+process.env.MONGODB_USER_PASSWORD+'@cluster0.ma8hc.mongodb.net/movie_upload?retryWrites=true&w=majority')

app.get("/add-user_to_movie", (req, res) => {
  
});
  


app.post("/upload", [jwtCheck, multerUploads], function (req, res) {
  console.log("start");
  console.log(req.body);

  //jwt decoding
  // console.log(jwt_decode(req.get('Authorization').split(' ')[1]));

  if (req.file) {
    console.log("IN");

    const file = dataUri(req);
    cloudinary.config();

    return cloudinary.uploader
      .upload(file)
      .then((result) => {
        const image = result.url;

        console.log("in");
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).json({
          messge: "Your image has been uploded successfully to cloudinary",
          data: {
            image,
          },
        });

        console.log(res);
        console.log("in the end");
      })
      .catch((error) =>
        res.status(400).json({
          messge: "something went wrong while processing your request",
          data: {
            err,
          },
        })
      );
  }
  console.log("out");
});

app.listen(port, () => console.log(`Listening to port ${port}`));
