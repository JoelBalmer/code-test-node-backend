var connectMongo = require('./../utils/mongodb');
var getRoom = require('./../queries/getSingleRoom');

module.exports = function getRoomRoute(req, res, next) {
  function onMongoConnected(db) {
    // Mongo query
    getRoom(db, req.params.id, function(room) {
      if (!room) {
        res.status(404).json({message: "Couldn't find that room"});
      } 
      else {
        res.status(200).json(room);
      }
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
};