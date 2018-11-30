var connectMongo = require('./../utils/mongodb');
var getRooms = require('./../queries/getSingleRoom');

module.exports = function getRoomRoute(req, res, next) {
  function onMongoConnected(db) {
    // Mongo query
    getRoom(db, req.params.id, function(room) {
      if (!rooms) {
        res.status(404).json({message: "Couldn't find that room"});
      } 
      else {
        res.status(200).json(rooms);
      }
    });
  }

  // Run onMongoConnected once successful connection
  connectMongo(onMongoConnected);
};


// function getRoomRoute(req, res, next) {
//   var client = new MongoClient(uri);
//   client.connect(function(err) {
//     if (err) {
//       console.log("Error connecting to MongoDB:\n" + err);
//       return;
//     }
//     console.log("Connected successfully to MongoDB");
//     var db = client.db(dbName);

//     getRoom(db, req.params.id, function(room) {
//       if (!room) {
//         res.status(404).json({"message" : "Couldn't find that room"});
//       }
//       else {
//         res.status(200).json(room);
//       }
      
//       client.close();
//     });
//   });
// }