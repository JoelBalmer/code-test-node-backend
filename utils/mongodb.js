var MongoClient = require("mongodb").MongoClient;
var MongoConfig = require("./../config").mongodb;

module.exports = function mongoConnect(callback) {
  var client = new MongoClient(MongoConfig.uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB:\n" + err);
      return;
    }
    
    console.log("Connected successfully to MongoDB");
    var db = client.db(MongoConfig.dbName);
    callback(db);
    
    client.close();
  });
};