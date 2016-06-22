var express = require("express");
var router = express.Router();
var user = require("../actions/user");

router.post('/signup', user.signup);
router.post('/signin', user.signin);

module.exports = router;