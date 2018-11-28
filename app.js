// Imported packages
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
var express = require("express");
var helmet = require("helmet");
var bodyParser = require("body-parser");
var basicAuth = require("express-basic-auth");

// Global variables
var error;

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

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle Express Basic xxx authentication
app.use(
  basicAuth({
    users: {
      user: "secret",
      admin: "supersecret"
    },
    unauthorizedResponse: {"message" : "User details incorrect"}
  })
);

/* 
HTTP request routes 
*/

// Get usage
app.get("/api/room/usage", getUsageRoute);
function getUsageRoute(req, res, next) {
  var roomId = req.query.roomId || "";

  // Reject if no dates supplied
  if (!req.query.startDate || !req.query.endDate) {
    var err = new Error("Date values not supplied");
    err.status = 400;
    next(err);  
    return;
  }

  // Connect to MongoDB
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB:\n" + err);
      next(err);
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    // Request usage from MongoDB
    getUsage(db, req.query.startDate, req.query.endDate, roomId, function(usage) {
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

// Get all rooms
app.get("/api/room/", getRoomsRoute);
function getRoomsRoute(req, res, next) {
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB:\n" + err);
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
      console.log("Error connecting to MongoDB:\n" + err);
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

// Set room availability and name
app.put("/api/room/:id", setRoomRoute);
function setRoomRoute(req, res, next) {
  // Check values are supplied
  var availabilityExists = typeof req.body.available === "boolean";
  var nameExists = req.body.name;

  // Check which route is required
  if (availabilityExists) {
    console.log("1 Req param id is:\n" + req.params.id);
    setAvailabilityRoute(req, res, next);
  }
  if (nameExists && req.body.name.length > 0) {
    setNameRoute(req, res, next);
  }
  if (!nameExists && !availabilityExists) {
    var err = new Error("No values supplied");
    err.status = 400;
    next(err);  
    return;
  }
  
  // Only send response here, due to 'Can't remove headers after they are sent' error
  if (error) {
    next(error);
    error = null;
  }
  else {
    res.status(204).json();
  }
}
function setAvailabilityRoute(req, res, next) {
  // Set id with correct type to pass in
  var id = String(req.params.id);

  // Connect to MongoDB
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB:\n" + err);
      return;
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    setAvailability(db, id, req.body.available, req.auth.user, function(room) {
      if (!room) {
        res.status(404).json({"message" : "Couldn't update availability"});
        client.close();
        return;
      }
      
      client.close();
    });
  });
}
function setNameRoute(req, res, next) {
  // Check user permissions
  if (req.auth.user !== "admin") {
    error = new Error("Not an admin: Can't update a room name");
    error.status = 401;
    return;
  }

  // Connect to MongoDB
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB:\n" + err);
      return;
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    setName(db, req.params.id, req.body.name, req.auth.user, function(room) {
      if (!room) {
        res.status(404).json({"message" : "Couldn't set room name"});
        client.close();
        return;
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
    var err = new Error("Not an admin: Can't create a room");
    err.status = 401;
    next(err);
    return;
  }

  // Connect to MongoDB
  var client = new MongoClient(uri);
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB:\n" + err);
      return;
    }
    console.log("Connected successfully to MongoDB");
    var db = client.db(dbName);

    addRoom(db, req.body.name, req.auth.user, function(name) {
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

/*
Database query functions
*/

// Find all rooms
function getRooms(db, callback) {
  var collection = db.collection("rooms");
  collection.find({}).toArray(function(err, rooms) {
    if (err) {
      console.log("Error finding rooms:\n" + err);
      return;
    }

    console.log("Found the following rooms:\n" + rooms);
    callback(rooms);
  });
}

// Find single room
function getRoom(db, roomId, callback) {
  var collection = db.collection("rooms");
  collection.findOne({id: roomId}, function(err, room) {
    if (err) {
      console.log("Error finding room:\n" + err);
      return;
    }
    console.log("Found the following room:\n" + room);
    callback(room);
  });
}

// Find and update room availability
function setAvailability(db, id, availability, user, callback) {
  var collection = db.collection("rooms");
  var booleanValue = Boolean(availability);
  collection.updateOne(
    {"id" : id},
    {$set : {"available" : booleanValue}},
    function (err, room) {
      if (err) {
        console.log("Error updating room availability:\n" + err);
        return;
      }
      
      // Get newly added room
      collection.findOne({id: id}, function(err, addedRoom) {
        if (err) {
          console.log("Error finding room:\n" + err);
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
        var collection2 = db.collection("usage");
        collection2.insertOne(usage, function(err, usage) {
          if (err) {
            console.log("Error inserting usage:\n" + err);
            return;
          }
          console.log("Inserted usage into the collection:\n" + usage);

          // Finish with callback
          callback(addedRoom);
        });
      });
    }
  );
}

// Find and update room name
function setName(db, id, name, user, callback) {
  var collection = db.collection("rooms");
  collection.updateOne(
    {"id" : id},
    {$set : {"name" : name}},
    function (err, room) {
      if (err) {
        console.log("Error updating room name:\n" + err);
        return;
      }

      // Get newly updated room
      collection.findOne({id: id}, function(err, addedRoom) {
        if (err) {
          console.log("Error finding room:\n" + err);
          return;
        }
        console.log("Updated the following room's name:\n" + addedRoom.id);
        
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
        var collection2 = db.collection("usage");
        collection2.insertOne(usage, function(err, usage) {
          if (err) {
            console.log("Error inserting usage:\n" + err);
            return;
          }
          console.log("Inserted usage into the collection:\n" + usage);

          // Finish with callback
          callback(addedRoom);
        });
      });
    }
  );
}

// Insert room
function addRoom(db, name, user, callback) {
  var roomToAdd = {
    "name": name,
    "available": true
  };

  var collection = db.collection("rooms");
  collection.insertOne(roomToAdd, function(err, room) {
    if (err) {
      console.log("Error inserting rooms:\n" + err);
      return;
    }

    // Swap ._id for .id
    var objectIdString = room.ops[0]._id.toString();
    collection.updateOne(
      {"_id" : ObjectId(objectIdString)},
      {$set : {"id" : objectIdString}},
      function(err, addedRoom) {
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
        var collection2 = db.collection("usage");
        collection2.insertOne(usage, function(err, usage) {
          if (err) {
            console.log("Error inserting usage:\n" + err);
            return;
          }
          console.log("Inserted usage into the collection:\n" + usage);

          // Finish with callback
          callback(addedRoom);
        });
      }
    );
  });
}

// Find usage
function getUsage(db, start, end, roomId, callback) {
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

  // Connet to MongoDB
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
}

/*
Error handling
*/

// Send a caught error, otherwise send 500 error
app.use(errorHandler);
function errorHandler(err, req, res, next) {
  if (!err.status) {
    err.status = 500;
  }

  res.status(err.status).json({ message: err.message });
  next(err);
}

// Handle 404 not found
app.use(notFound404Handler);
function notFound404Handler(req, res, next) {
  res.status(404).json({ message: "Sorry can't find that!" });
}