function errorHandler(err, req, res, next) {
  res.status(err.output.statusCode || 500).json(err.output.payload);
}

module.exports = errorHandler;