const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

// Connect to the in-memory database.
const connect = async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts);
}


// Drop database, close the connection and stop mongod.
const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
}


// Remove all the data for all db collections.
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

module.exports = {
    connect,
    closeDatabase,
    clearDatabase
}