const app = require('./src/app');
const mongoose = require("mongoose");


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