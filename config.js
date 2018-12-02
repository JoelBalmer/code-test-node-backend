var uri = "mongodb://admin:" + process.env.MONGO_PASS + "@ds115854.mlab.com:15854/roombooker";

module.exports = {
  "mongodb" : {
    "uri" : uri,
    "dbName" : "roombooker"
  }
};