function errorHandler(err, req, res, next) {
  res.status(err.statusCode || 500).json(err);
}

module.exports = errorHandler;