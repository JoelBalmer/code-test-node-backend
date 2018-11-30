module.exports = function insertUsage(db, usage, callback) {
  var collection = db.collection("usage");
  collection.insertOne(usage, function(err, usage) {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Inserted usage into the collection:\n" + usage);

    // Finish with callback
    callback();
  });
}