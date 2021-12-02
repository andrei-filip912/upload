require("dotenv").config(); 
const express = require("express");
const cloudinary = require("./config/cloudinaryConfig");
const { multerUploads, dataUri } = require("./middleware/multer");
const { jwtCheck } = require("./auth/checkJwt");
const jwt_decode = require("jwt-decode");
const cors = require("cors");
const mongoose = require("mongoose");
const User_to_movie = require('./models/user_to_movie');

// create the app, set the port
const app = express();
const port = process.env.PORT || 4000;

// declare connection string 
const dbURI = 'mongodb+srv://'
 + process.env.MONGODB_USERNAME
 + ':'
 + process.env.MONGODB_USER_PASSWORD 
 + '@cluster0.ma8hc.mongodb.net/movie_upload?retryWrites=true&w=majority';

 // connect the app to db, then start the app
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(port, () => console.log(`Listening to port ${port}`)))
  .catch(err => console.log(err));

// using middleware cors, json for body parsing and urlencoded
app.use(cors());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));


async function addUser(user_id, movie) {
  const user_to_movie = new User_to_movie({
    user_id: user_id,
    movies: [movie]
  });

  return await user_to_movie.save();
}
async function addMovieToUser(user, movie) {
  user.movies.push(movie);

  return await user.save();
}
async function updateOrCreateUser(user_id, movie) {
  let result;
  const filter = { user_id: user_id };

  const user = await User_to_movie.findOne(filter);

  if(user != undefined){
    result = await addMovieToUser(user, movie);
  }
  else{
    result = await addUser(user_id, movie);
  }

  return result;
  
}

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

        // why do I always get status200 ok
        updateOrCreateUser(user_id, movie)
        .then(response => console.log(response))
        .catch(err => { 
          res.set("Access-Control-Allow-Origin", "*");
          res.status(400).json({
            message: "something went wrong while processing your request",
            data: {
              err,
            },
          });
         });

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
