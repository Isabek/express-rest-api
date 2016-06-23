var _ = require("lodash");
var boom = require("boom");
var Car = require("../models/car").Car;

function create(req, res, next) {
  var name = req.body.name;
  var type = req.body.type;
  var mark = req.body.mark;
  var price = req.body.price;

  if (_.isEmpty(name) || _.isEmpty(type) || _.isEmpty(mark)) {
    return next(boom.badRequest("Fill all required fields"));
  }

  Car({name: name, type: type, mark: mark, price: price, user: req.user._id}).save(function (err, car) {
    if (err || _.isEmpty(car)) {
      return next(boom.internal('Please, try again later'));
    }

    return res.json({
      message: "Car has been successfully added"
    });
  });
}

function edit(req, res, next) {

  var carId = req.params.id;
  var name = req.body.name;
  var type = req.body.type;
  var mark = req.body.mark;
  var price = req.body.price;

  if (_.isEmpty(carId) || _.isEmpty(name) || _.isEmpty(type) || _.isEmpty(mark)) {
    return next(boom.badRequest("Fill all required fields"));
  }

  Car.findByIdAndUpdate(carId, {name: name, type: type, mark: mark, price: price}, function (err, car) {
    if (err || _.isEmpty(car)) {
      return next(boom.notFound("Car not found"));
    }

    return res.json({
      message: "Car has been successfully updated"
    });

  });
}

function read(req, res, next) {
  var carId = req.params.id;

  Car.findOne({_id: carId}, function (err, car) {
    if (err || _.isEmpty(car)) {
      return next(boom.notFound("Car not found"));
    }

    return res.json({
      data: car
    });
  });
}

exports.create = create;
exports.edit = edit;
exports.read = read;
