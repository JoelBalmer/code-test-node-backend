var connectMongo = require('./../utils/mongodb');
var getRooms = require('./../queries/getAllRooms');

module.exports = function getRoomsRoute(req, res, next) {
  function onMongoConnected(db) {
    // Mongo query
    getRooms(db, function(rooms) {
      if (!rooms) {
        res.status(404).json({message: "Couldn't find any rooms"});
      } 
      else {
        res.status(200).json(rooms);
      }
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
};