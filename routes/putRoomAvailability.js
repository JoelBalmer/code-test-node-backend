var connectMongo = require('./../utils/mongodb');

var createError = require("./../utils/createError");

module.exports = function setAvailabilityRoute(req, res, next) {
  // Set id with correct type to pass in
  var id = String(req.params.id);

  function onMongoConnected(database) {
    // Mongo query
    setAvailability(database.db(), id, req.body.available, req.auth.user, function(room) {
      if (!room) {
        next(createError("Couldn't update availability", 404));
        return;
      }
      else {
        res.status(204).json();
      }

      database.close();
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
};