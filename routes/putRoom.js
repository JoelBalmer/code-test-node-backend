var connectMongo = require('./../utils/mongodb');
var setAvailability = require('./../queries/putRoomAvailability');
var setName = require('./../queries/putRoomName');
var createError = require("./../utils/createError");
var allAdmins = require("./../users").admins;
var truncateName = require("./../utils/truncateName");

module.exports = function setRoomRoute(req, res, next) {
  // Check values are supplied
  var availabilityExists = typeof req.body.available === "boolean";
  var nameExists = req.body.name;

  if (availabilityExists) {
    setAvailabilityRoute(req, res, next);
  }
  if (nameExists && req.body.name.length > 0) {
    // Check user permissions
    if (allAdmins.indexOf(req.auth.user) < 0) {
      next(createError("Not an admin: Can't update a room name", 401));  
      return;
    }

    setNameRoute(req, res, next);
  }
  if (!nameExists && !availabilityExists) {
    next(createError("No values supplied", 400));  
    return;
  }

  res.status(204).json();
};

// Run query on room and set availability
function setAvailabilityRoute(req, res, next) {
  // Set id with correct type to pass in
  var id = String(req.params.id);

  function onMongoConnected(database) {
    // Mongo query
    setAvailability(database.db(), id, req.body.available, req.auth.user, function(room) {
      if (!room) {
        next(createError("Couldn't update availability", 404));
        return;
      }

      database.close();
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
}

// Run query on room and set name
function setNameRoute(req, res, next) {
  function onMongoConnected(database) {
    // Mongo query
    setName(database.db(), req.params.id, truncateName(req.body.name), req.auth.user, function(room) {
      if (!room) {
        next(createError("Couldn't set room name", 404));  
        return;
      }

      database.close();
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
}
