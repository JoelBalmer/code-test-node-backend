module.exports = function getRooms(db, callback) {
  var collection = db.collection("rooms");
  collection.find({}).toArray(function(err, rooms) {
    if (err) {
      console.log("Error finding rooms:\n" + err);
      return;
    }

    console.log("Found the following rooms:\n" + rooms);
    callback(rooms);
  });
};