var connectMongo = require('./../utils/mongodb');
var getRoom = require('./../queries/getSingleRoom');
var createError = require("./../utils/createError");

module.exports = function getRoomRoute(req, res, next) {
  function onMongoConnected(database) {
    // Mongo query
    getRoom(database.db(), req.params.id, function(room) {
      if (!room) {
        next(createError("Couldn't find that room", 401));  
        return;
      } 
      else {
        res.status(200).json(room);
      }

      database.close();
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
};