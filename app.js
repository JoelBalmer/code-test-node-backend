var MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
var express = require("express");
var helmet = require("helmet");
var bodyParser = require("body-parser");
var basicAuth = require("express-basic-auth");

// Mongo setup
var uri =
  "mongodb://admin:jeeves-567-HELLO!@ds115854.mlab.com:15854/roombooker";
var dbName = "roombooker";

// Express server setup
var app = express();
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server running on port: " + port);
});
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handle Express Basic xxx authentication
app.use(
  basicAuth({
    users: {
      user: "secret",
      admin: "supersecret"
    },
    unauthorizedResponse: {"message" : "Not a user"}
  })
);

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get all rooms
app.get("/api/room/", getRoomsRoute);
function getRoomsRoute(req, res, next) {
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB: " + err);
      return;
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    getRooms(db, function(rooms) {
      if (!rooms) {
        res.status(404).json({"message" : "Couldn't find any rooms"});
      }
      else {
        res.status(200).json(rooms);
      }
      
      client.close();
    });
  });
}

// Get single room
app.get("/api/room/:id", getRoomRoute);
function getRoomRoute(req, res, next) {
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB: " + err);
      return;
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    getRoom(db, req.params.id, function(room) {
      if (!room) {
        res.status(404).json({"message" : "Couldn't find that room"});
      }
      else {
        res.status(200).json(room);
      }
      
      client.close();
    });
  });
}

// Add a room
app.post("/api/room/", addRoomRoute);
function addRoomRoute(req, res, next) {
  // Check user permissions
  if (req.auth.user !== "admin") {
    var err = new Error("Not an admin");
    err.status = 401;
    next(err);
    return;
  }

  // Connect to MongoDB
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB: " + err);
      return;
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    addRoom(db, req.body.name, function(name) {
      if (!name) {
        res.status(404).json({"message" : "Couldn't create a room"});
      }
      else {
        res.status(204).json();
      }
      
      client.close();
    });
  });
}

// Get usage
app.get("/api/room/usage", getUsageRoute);
function getUsageRoute(req, res, next) {
  // Connect to MongoDB
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB: " + err);
      next(err);
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    // Request usage from MongoDB
    getUsage(db, req.query.startDate, req.query.endDate, function(usage) {
      if (!usage) {
        res.status(404).json({"message" : "Couldn't find any usage"});
      }
      else {
        res.status(200).json(usage);
      }

      client.close();
    });
  });
}

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

function getRoom(db, roomId, callback) {
  var collection = db.collection("rooms");
  collection.findOne({id: roomId}, function(err, room) {
    if (err) {
      console.log("Error finding room: " + err);
      return;
    }
    console.log("Found the following room");
    console.log(room);
    callback(room);
  });
}

function addRoom(db, name, callback) {
  // Create room object
  var collection = db.collection("rooms");
  var roomToAdd = {
    "name": name,
    "available": true
  };
  collection.insertOne(roomToAdd, function(err, room) {
    if (err) {
      console.log("Error inserting rooms: " + err);
      return;
    }

    // Swap ._id for .id
    var objectIdString = room.ops[0]._id.toString();
    collection.updateOne(
      {"_id" : ObjectId(objectIdString)},
      {$set : {"id" : objectIdString}}
    );
    console.log("Inserted the following room '" + name + "' into the collection");
    callback(name);
  });
}

function getUsage(db, start, end, callback) {
  // Convert dates
  var startDate = new Date(start).toISOString();
  var endDate = new Date(end).toISOString();

  var collection = db.collection("usage");
  console.log(collection);
  collection
    .find({
      "time" : { 
        $gte: startDate,
        $lte: endDate
      },
    })
    .toArray(function(err, usage) {
      if (err) {
        console.log("Error finding usage: " + err);
        return;
      }

      console.log("Found the following usage");
      console.log(usage);
      callback(usage);
  });
}

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