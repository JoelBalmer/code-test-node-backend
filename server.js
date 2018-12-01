var helmet = require("helmet");
var bodyParser = require("body-parser");
var basicAuth = require("express-basic-auth");
var app = require('./app');
var allUsers = require("./users").allUsers;

// Import routes
var getRoomsRoute = require("./routes/getAllRooms");
var getRoomRoute = require("./routes/getSingleRoom");
var getUsageRoute = require("./routes/getUsage");
var setRoomRoute = require("./routes/putRoom");
var addRoomRoute = require("./routes/postNewRoom");

// Express server setup
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server running on port: " + port);
});

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Basic authentication handling
app.use(basicAuth({
  users: allUsers,
  unauthorizedResponse: {"message" : "User details incorrect"}
}));

// HTTP request routes 
app.get("/api/room/usage", getUsageRoute);
app.get("/api/room/", getRoomsRoute);
app.get("/api/room/:id", getRoomRoute);
app.put("/api/room/:id", setRoomRoute);
app.post("/api/room/", addRoomRoute);

// General error handling
app.use(errorHandler);
function errorHandler(err, req, res, next) {
  if (!err.status) {
    err.status = 500;
  }

  res.status(err.status).json({ message: err.message });
  next(err);
}

// 404 not found error handling
app.use(notFound404Handler);
function notFound404Handler(req, res, next) {
  res.status(404).json({ message: "Sorry can't find that!" });
}

module.exports = app;