const { Schema } = require('mongoose');
const core = require('../core');

const rateMyPlateSchema = new core.Schema({
  contentType: String,
  image: Buffer,
  title: String,
  desc: String,
  rating: Number,
  rated: { type: Boolean, default: false },
});

const rateMyPlateModel = core.mongoose.model('ratemyplate', rateMyPlateSchema);

module.exports.rateMyPlateModel = rateMyPlateModel;
