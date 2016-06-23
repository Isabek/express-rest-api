var mongoose = require("mongoose");
var relationship = require("mongoose-relationship");

var CarSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  mark: {type: String},
  price: {type: Number},
  created: {type: Date, default: Date.now},
  user: {type: mongoose.Schema.ObjectId, ref: "User", childPath: "cars"}
});

CarSchema.plugin(relationship, {relationshipPathName: 'user'});

exports.Car = mongoose.model('Car', CarSchema);