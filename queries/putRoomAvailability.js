var insertUsage = require("./insertUsage");

module.exports = function setAvailability(db, id, availability, user, callback) {
  var booleanValue = Boolean(availability);
  
  var collection = db.collection("rooms");
  collection.updateOne({"id" : id}, {$set : {"available" : booleanValue}}, function (err, room) {
    if (err) {
      console.log(err);
      return;
    }
    
    // Get newly added room
    collection.findOne({id: id}, function(err, addedRoom) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("Updated the following room's availability:\n" + addedRoom.id);
      
      // Add to usage collection
      var usage = {
        "time": new Date().toISOString(),
        "user": user,
        "room": {
          "id": addedRoom.id,
          "name": addedRoom.name
        },
        "available": addedRoom.available
      };

      insertUsage(db, usage, function() {
        callback(addedRoom);
      });
    });
  });
};