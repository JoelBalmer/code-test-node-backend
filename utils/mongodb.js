var MongoClient = require("mongodb").MongoClient;
var MongoConfig = require("./../config").mongodb;

module.exports = function connectMongo(callback) {
  MongoClient.connect(MongoConfig.uri, function(err, database) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log("Connected successfully to MongoDB");
    callback(database);
  });
};