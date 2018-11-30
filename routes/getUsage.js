var connectMongo = require('./../utils/mongodb');
var getUsage = require('./../queries/getUsage');

module.exports = function getUsageRoute(req, res, next) {
  // Reject if no dates supplied
  if (!req.query.startDate || !req.query.endDate) {
    var err = new Error("Date values not supplied");
    err.status = 400;
    next(err);  
    return;
  }
  
  var roomId = req.query.roomId || "";
  function onMongoConnected(db) {
    // Mongo query
    getUsage(db, req.query.startDate, req.query.endDate, roomId, function(usage) {
      if (!usage) {
        res.status(404).json({"message" : "Couldn't find any usage"});
      }
      else {
        res.status(200).json(usage);
      }
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
};
