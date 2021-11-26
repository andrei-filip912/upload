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

// declare connection string and connect the app
const dbURI = 'mongodb+srv://vscodeUser:' +
  process.env.MONGODB_USER_PASSWORD +   
  '@cluster0.ma8hc.mongodb.net/movie_upload?retryWrites=true&w=majority';
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(port, () => console.log(`Listening to port ${port}`)))
  .catch(err => console.log(err));

// using middleware cors, json for body parsing and urlencoded
app.use(cors());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));



app.get("/add-user_to_movie", (req, res) => {
  const user_to_movie = new User_to_movie({
    user_id: 'auth0|afsdfasdfasdf',
  movies: [{
      title: 'Cicarlau',
      url: 'www.sdf.cosd',
      length: 5123451435
  }]
  });

  user_to_movie.save()
  .then((result) => res.send(result))
  .catch(err => console.log(err));
});

app.get('/add-or-create-user_to_movie', (req, res) => {
  const newMovie = {
    title: 'Cicarlau 3D',
      url: 'www.abc.cosd',
      length: 12346
  };
  const filter = { user_id: 'auth0|afsdfasdfasdf' };

  User_to_movie.findOneAndUpdate(filter, newMovie, { returnOriginal: false})
  .then(response => res.send(response))
  .catch(err => console.log(err));

  // User_to_movie.find()
  // .then((result) => res.send(result))
  // .catch(err => console.log(err));
});

app.post("/upload", [jwtCheck, multerUploads], function (req, res) {
  //jwt decoding
  // console.log(jwt_decode(req.get('Authorization').split(' ')[1]));

  if (req.file) {
    const file = dataUri(req);
    cloudinary.config();

    return cloudinary.uploader
      .upload(file)
      .then((result) => {
        const image = result.url;

        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).json({
          messge: "Your image has been uploded successfully to cloudinary",
          data: {
            image,
          },
        });
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
});
