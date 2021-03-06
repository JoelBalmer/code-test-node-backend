var connectMongo = require("./../utils/mongodb");
var addRoom = require("./../queries/postNewRoom");
var createError = require("./../utils/createError");
var allAdmins = require("./../users").admins;
var truncateName = require("./../utils/truncateName");

module.exports = function addRoomRoute(req, res, next) {
  // Check user permissions
  if (allAdmins.indexOf(req.auth.user) < 0) {
    next(createError("Not an admin: Can't create a room", 401));
    return;
  }

  function onMongoConnected(database) {
    // Mongo query
    addRoom(database.db(), truncateName(req.body.name), req.auth.user, function(name) {
      if (!name) {
        next(createError("Couldn't create a room", 404));
        return;
      }
      else {
        res.status(204).json();
      }

      database.close();
    });
  }

  // Connect to MongoDB
  connectMongo(onMongoConnected);
};