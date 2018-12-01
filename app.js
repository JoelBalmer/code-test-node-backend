var express = require("express");
var app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/test/", function(req, res) {
  res.status(200).send("Test worked!");
});

module.exports = app;