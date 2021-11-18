const { MongoClient } = require('mongodb');
require('dotenv').config();


const uri = `mongodb+srv://af912:${process.env.MONGODB_USER_PASSWORD}@cluster0.ma8hc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//  client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
//   return collection;
// });

function getQuery() {
    client.connect(err => {
        const collection = client.db("sample_analytics").collection("accounts");
        // perform actions on the collection object
        console.log(collection.findOne(ObjectId("5ca4bbc7a2dd94ee5816238d")));
        client.close();
      });
}

module.exports = {getQuery};