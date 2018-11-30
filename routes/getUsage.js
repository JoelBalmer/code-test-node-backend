var connectMongo = require('./../utils/mongodb');
var getRooms = require('./../queries/getUsage');

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

// function getUsageRoute(req, res, next) {
//   var roomId = req.query.roomId || "";

//   // Reject if no dates supplied
//   if (!req.query.startDate || !req.query.endDate) {
//     var err = new Error("Date values not supplied");
//     err.status = 400;
//     next(err);  
//     return;
//   }

//   // Connect to MongoDB
//   var client = new MongoClient(uri);
//   client.connect(function(err) {
//     if (err) {
//       console.log("Error connecting to MongoDB:\n" + err);
//       next(err);
//     }
//     console.log("Connected successfully to MongoDB");
//     var db = client.db(dbName);

//     // Request usage from MongoDB
//     getUsage(db, req.query.startDate, req.query.endDate, roomId, function(usage) {
//       if (!usage) {
//         res.status(404).json({"message" : "Couldn't find any usage"});
//       }
//       else {
//         res.status(200).json(usage);
//       }

//       client.close();
//     });
//   });
// }