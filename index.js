var app = require("./app");
var http = require("http");

var port = process.env.PORT || 3000;
var host = process.env.HOST || '0.0.0.0';

var server = http.createServer(app);
server.listen(port, host);

server.on('listening', function () {
  console.log("Server running on: %s:%s", host, port);
});

server.on('error', function (error) {
  throw error;
});