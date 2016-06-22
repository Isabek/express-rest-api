var _ = require("lodash");
var boom = require("boom");

function errorHandler(err, req, res, next) {
  if (_.has(err, 'status')) err = boom.create(err.status, err.message);
  res.status(err.output.statusCode || 500).json(err.output.payload);
}

module.exports = errorHandler;