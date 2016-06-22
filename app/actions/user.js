var _ = require("lodash");
var error = require("throw.js");
var User = require("../models/user").User;

function signup(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;

  if (_.isEmpty(username) || _.isEmpty(password)) {
    return next(new error.badRequest());
  }

  if (!_.isEqual(password, confirm)) {
    return next(new error.badRequest('Passwords must match'));
  }

  User({username: username, password: password}).save(function (err) {
    if (err) {
      if (err.code == 11000) {
        return next(new error.badRequest('User with this username already exists'));
      }
      return next(new error.internalServerError('Please, try again later'));
    }
    return res.status(201).json({
      'message': 'User has been successfully registered'
    });
  });
}

exports.signup = signup;