var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan")('combined');
var mongoose = require("mongoose");
require("dotenv").config();

var crossDomain = require("./libs/cross-domain");
var errorHandler = require("./libs/error-handler");

var user = require("./app/routes/user");
var car = require("./app/routes/car");

var app = express();

app.use(bodyParser.json());
app.use(morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(crossDomain);

app.use('/api/user/', user);
app.use('/api/car/', car);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/qs_test_db');
mongoose.connection.on('error', function (err) {
  console.error("Connection error: ", err.message);
});
mongoose.connection.on('open', function () {
  console.log("Connected to mongo");
});

module.exports = app;