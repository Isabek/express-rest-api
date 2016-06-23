var express = require("express");
var jwt = require("express-jwt");
var car = require("../actions/car");

var router = express.Router();

router.post('/', jwt({secret: process.env.SECRET_KEY}), car.create);
router.put('/:id', jwt({secret: process.env.SECRET_KEY}), car.edit);
router.get('/:id', car.read);
router.delete('/:id', jwt({secret: process.env.SECRET_KEY}), car.remove);
router.get('/',  car.all);

module.exports = router;