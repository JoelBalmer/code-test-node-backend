var createError = require("./../utils/createError");
var connectMongo = require('./../utils/mongodb');
var getUsage = require('./../queries/getUsage');

module.exports = function getUsageRoute(req, res, next) {
  // Reject if no dates supplied
  if (!req.query.startDate || !req.query.endDate) {
    next(createError("Date values not supplied", 400));    
    return;
  }
  
  var roomId = req.query.roomId || "";
  function onMongoConnected(database) {
    // Mongo query
    getUsage(database.db(), req.query.startDate, req.query.endDate, roomId, function(usage) {
      if (!usage) {
        next(createError("Couldn't find any usage", 404));    
        return;
      }
      else {
        res.status(200).json(usage);
      }

      database.close();
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
};
