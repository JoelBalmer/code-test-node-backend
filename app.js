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

// Rooms routes
app.get("/api/room/", function(req, res, next) {
    var entries =
    [
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
    ]
    res.status(200).json(entries);
});