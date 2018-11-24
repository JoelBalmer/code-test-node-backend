var MongoClient = require('mongodb').MongoClient;
var express = require("express");
var helmet = require("helmet");
var bodyParser = require("body-parser");

// Dummy data
var rooms = [
    {
        "id": "abc123",
        "name": "Meeting Room 1",
        "available": true
    },
    {
        "id": "def456",
        "name": "Meeting Room 2",
        "available": true
    }
];

var usage = [
    {
        "time": "2017-01-01T10:02:15Z",
        "user": "Jeff",
        "room": {
            "id": "abc123",
            "name": "Meeting Room 1",
        "available": true
    },
    {
        "time": "2017-01-01T11:02:15Z",
        "user": "Bob",
        "room": {
            "id": "def456",
            "name": "Meeting Room 2",
        "available": false
    }
];

// Mongo setup
var uri = "mongodb://admin:jeeves-567-HELLO!@ds115854.mlab.com:15854/roombook";
var dbName = 'roombooker';
var client = new MongoClient(uri);

// Connect to MongoDB
client.connect(function (err) {
	if (err) {
        console.log("Error connecting to MongoDB: " + err);
        return;
    }
	console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    
    // Get rooms
	getRooms(db, function() {
        insertDocuments(db, function () {
            client.close();
	    });
	});
});

var getRooms = function (db, callback) {
 	var collection = db.collection('rooms');
 	collection.find({}).toArray(function (err, rooms) {
 		if (err) {
            console.log("Error finding rooms: " + err);
            return;
        }
        
 		console.log('Found the following rooms');
 		console.log(rooms);
 		callback(rooms);
 	});
};

// Add documents
var insertRooms = function (db, callback) {
	// Get the documents collection
	var collection = db.collection('rooms');
	collection.insertMany(rooms, function (
		err,
		result
	) {
		if (err) {
            console.log("Error inserting rooms: " + err);
            return;
        }
		console.log('Inserted 3 documents into the collection');
        console.log(result.result.n);
        console.log(result.ops.length);
		callback(result);
	});
};

// Express server setup
var app = express();
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Server running on port: ` + port);
});

// Show welcome page
app.use(express.static("public"));

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
// Get all rooms
app.get("/api/room/", function(req, res, next) {
    res.status(200).json(rooms);
});

// Get single room
app.get("/api/room/:id", function(req, res, next) {
    res.status(200).json(rooms[0]);
});

// Get usage
app.get("/api/room/usage", function(req, res, next) {
    res.status(200).json(usage[0]);
});