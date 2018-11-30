module.exports = function getRoom(db, roomId, callback) {
  var collection = db.collection("rooms");
  collection.findOne({id: roomId}, function(err, room) {
    if (err) {
      console.log("Error finding room:\n" + err);
      return;
    }
    console.log("Found the following room:\n" + room);
    callback(room);
  });
};