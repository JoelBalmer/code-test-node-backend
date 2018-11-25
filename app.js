var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var helmet = require("helmet");
var bodyParser = require("body-parser");
var basicAuth = require("express-basic-auth");

// Mongo setup
var uri =
  "mongodb://admin:jeeves-567-HELLO!@ds115854.mlab.com:15854/roombooker";
var dbName = "roombooker";

// Database functions
function getRooms(db, callback) {
  var collection = db.collection("rooms");
  collection.find({}).toArray(function(err, rooms) {
    if (err) {
      console.log("Error finding rooms: " + err);
      return;
    }

    console.log("Found the following rooms");
    console.log(rooms);
    callback(rooms);
  });
}

function insertRooms(db, callback) {
  var collection = db.collection("rooms");
  collection.insertMany(rooms, function(err, result) {
    if (err) {
      console.log("Error inserting rooms: " + err);
      return;
    }
    console.log("Inserted 3 documents into the collection");
    console.log(result.result.n);
    console.log(result.ops.length);
    callback(result);
  });
}

function getUsage(db, callback) {
  var collection = db.collection("usage");
  console.log(collection);
  collection.find({}).toArray(function(err, usage) {
    if (err) {
      console.log("Error finding usage: " + err);
      return;
    }

    console.log("Found the following usage");
    console.log(usage);
    callback(usage);
  });
}

// Express server setup
var app = express();
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server running on port: " + port);
});

// Setup Express Basic xxx auth
app.use(
  basicAuth({
    users: {
      user: "secret",
      admin: "supersecret"
    }
  })
);

// Show welcome page
app.use(express.static("public"));

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get all rooms
app.get("/api/room/", function(req, res, next) {
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB: " + err);
      return;
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    getRooms(db, function(rooms) {
      res.status(200).json(rooms);
      client.close();
    });
  });
});

// Get usage
app.get("/api/room/usage/", function(req, res, next) {
  // Check user permissions

  if (req.auth.user !== "admin") {
    //res.status(401).json({ message: "Not an admin" });
    var err = new Error();
    err.message = "Not an admin";
    err.status = 401;
    next(err);
    return;
  }

  // Connect to MongoDB
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB: " + err);
      next(err);
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    getUsage(db, function(usage) {
      res.status(200).json(usage);
      client.close();
    });
  });
});

// Error handling
function errorHandler(err, req, res, next) {
  if (!err.status) {
    err.status = 500;
  }

  res.status(err.status).json({ message: err.message });
  next(err);
}
app.use(errorHandler);

// Handle 404 not found
app.use(function(req, res, next) {
  res.status(404).json({ message: "Sorry can't find that!" });
});
