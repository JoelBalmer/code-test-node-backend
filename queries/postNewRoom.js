var insertUsage = require("./insertUsage");
var ObjectId = require('mongodb').ObjectID;

module.exports = function addRoom(db, name, user, callback) {
  var roomToAdd = {
    "name": name,
    "available": true
  };

  var collection = db.collection("rooms");
  collection.insertOne(roomToAdd, function(err, room) {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Room added!");

    // Swap _id for id
    var objectIdString = room.ops[0]._id.toString();
    console.log(objectIdString);
    var collection2 = db.collection("rooms");
    collection2.updateOne(
      {"_id" : ObjectId(objectIdString)},
      {$set : {"id" : objectIdString}},
      function(err, addedRoom) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("Inserted the following room into the collection:\n" + addedRoom);
    
        // Add to usage collection
        var usage = {
          "time": new Date().toISOString(),
          "user": user,
          "room": {
            "id": objectIdString,
            "name": roomToAdd.name
          },
          "available": roomToAdd.available
        };

        // Insert usage and finish with callback
        insertUsage(db, usage, function() {
          callback(addedRoom);
        });
      }
    );
  });
}