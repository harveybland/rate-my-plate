const { Schema } = require('mongoose');
const core = require('../core');

const rateMyPlateSchema = new core.Schema({
  contentType: String,
  image: Buffer,
  rating: Number,
});

const rateMyPlateModel = core.mongoose.model('ratemyplate', rateMyPlateSchema);

module.exports.rateMyPlateModel = rateMyPlateModel;
