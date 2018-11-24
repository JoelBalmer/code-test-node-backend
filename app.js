var express = require("express");
var helmet = require("helmet");
var bodyParser = require("body-parser");

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

// Dummy data
var entries = [
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

// Get all rooms
app.get("/api/room/", function(req, res, next) {
    res.status(200).json(entries);
});

// Get single room
app.get("/api/room/:id", function(req, res, next) {
    res.status(200).json(entries[0]);
});

// Get usage
app.get("/api/room/usage", function(req, res, next) {
    res.status(200).json(usage[0]);
});