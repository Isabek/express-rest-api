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

    if (!_.isEqual(_.toString(req.user._id), _.toString(car.user))) {
      return next(boom.forbidden("You don\'t have permission to edit this car"));
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

function remove(req, res, next) {
  var carId = req.params.id;

  Car.findOne({_id: carId}, function (err, car) {
    if (err || _.isEmpty(car)) {
      return next(boom.notFound("Car not found"));
    }

    if (!_.isEqual(_.toString(req.user._id), _.toString(car.user))) {
      return next(boom.forbidden("You don\'t have permission to remove this car"));
    }

    car.remove(function (err) {
      if (err) {
        return next(boom.internal('Please, try again later'));
      }
      return res.json({
        message: "Car has been successfully removed"
      });
    });
  });
}

function all(req, res, next) {
  var sort = req.query.sort;
  var page = req.query.page || 1;
  var search = req.query.search || '';

  var limit = 10;
  var offset = limit * (page - 1);

  Car.count({}, function (err, total) {
    if (err) {
      return next(boom.internal('Something happened. Please, try again later'));
    }

    Car.find().skip(offset).limit(limit).exec(function (err, cars) {
      if (err) {
        return next(boom.internal('Something happened. Please, try again later'));
      }
      return res.json({
        data: cars,
        total: total
      });
    });

  });
}

exports.create = create;
exports.edit = edit;
exports.read = read;
exports.remove = remove;
exports.all = all;