require('dotenv').config();
const mongoose = require('mongoose');


const dbUri = `mongodb+srv://vscodeUser:${process.env.MONGODB_USER_PASSWORD}@cluster0.ma8hc.mongodb.net/movie_upload?retryWrites=true&w=majority`;
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((res) => console.log('connected to db!'))  // instead of connected to db you could use app listen to port
  .catch((err) => console.log(err));