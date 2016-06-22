var _ = require("lodash");
var error = require("throw.js");
var jwt = require("jsonwebtoken");
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

function signin(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (_.isEmpty(username) || _.isEmpty(password)) {
    return next(new error.unauthorized("Invalid username or password"));
  }

  User.findOne({username: username}, function (err, user) {
    if (err || _.isEmpty(user)) {
      return next(new error.unauthorized('Invalid username or password'));
    }

    user.comparePassword(password, function (isMatch) {
      if (!isMatch) {
        return next(new error.unauthorized('Invalid username or password'));
      }
      return res.json({
        token: jwt.sign(user.id, process.env.SECRET_KEY),
        username: username,
        message: "You have successfully logged in"
      })

    });
  });
}

exports.signup = signup;
exports.signin = signin;