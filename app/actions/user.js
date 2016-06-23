var _ = require("lodash");
var boom = require("boom");
var jwt = require("jsonwebtoken");
var User = require("../models/user").User;


function signup(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;

  if (_.isEmpty(username) || _.isEmpty(password)) {
    return next(boom.badRequest());
  }

  if (!_.isEqual(password, confirm)) {
    return next(boom.badRequest('Passwords must match'));
  }

  User({username: username, password: password}).save(function (err) {
    if (err) {
      if (err.code == 11000) {
        return next(boom.badRequest('User with this username already exists'));
      }
      return next(boom.internal('Please, try again later'));
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
    return next(boom.unauthorized("Invalid username or password"));
  }

  User.findOne({username: username}, function (err, user) {
    if (err || _.isEmpty(user)) {
      return next(boom.unauthorized('Invalid username or password'));
    }

    user.comparePassword(password, function (isMatch) {
      if (!isMatch) {
        return next(boom.unauthorized('Invalid username or password'));
      }
      return res.json({
        token: jwt.sign(user.toJSON(), process.env.SECRET_KEY, {expiresIn: '1d'}),
        username: username,
        message: "You have successfully logged in"
      });
    });
  });
}

exports.signup = signup;
exports.signin = signin;