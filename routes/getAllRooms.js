var connectMongo = require('./../utils/mongodb');
var getRooms = require('./../queries/getAllRooms');
var createError = require("./../utils/createError");

module.exports = function getRoomsRoute(req, res, next) {
  function onMongoConnected(database) {
    // Mongo query
    getRooms(database.db(), function(rooms) {
      if (!rooms) {
        next(createError("Couldn't find any rooms", 404)); 
        return;
      } 
      else {
        res.status(200).json(rooms);
      }

      database.close();
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
};