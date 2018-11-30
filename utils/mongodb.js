var MongoClient = require("mongodb").MongoClient;
var MongoConfig = require("./../config").mongodb;

module.exports = function connectMongo(callback) {
  //var client = new MongoClient(MongoConfig.uri);
  //client.connect(function(err) {
  MongoClient.connect(MongoConfig.uri, function(err, database) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log("Connected successfully to MongoDB");

    //var db = database.db('myDatabaseNameAsAString')

    // var db = database.db();

    //var db = client.db(MongoConfig.dbName);
    callback(database);
  });
};