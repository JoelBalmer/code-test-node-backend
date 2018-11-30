var createError = require("./../utils/createError");

module.exports = function getUsage(db, start, end, roomId, callback) {
  // Prepare the query object
  var queryObject = {};
  var startDate = new Date(start).toISOString();
  var endDate = new Date(end).toISOString();
  queryObject.time = { 
    $gte: startDate,
    $lte: endDate
  };
  if (roomId) {
    queryObject['room.id'] = roomId;
  }

  // Connect to MongoDB
  var collection = db.collection("usage");
  console.log(collection);
  collection
    .find(queryObject)
    .toArray(function(err, usage) {
      if (err) {
        console.log("Error finding usage:\n" + err);
        return;
      }

      console.log("Found the following usage:\n" + usage);
      callback(usage);
  });
};