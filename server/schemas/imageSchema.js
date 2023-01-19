const { Schema } = require('mongoose');
const core = require('../core');

const imagesSchema = new core.Schema({
  contentType: String,
  image: Buffer,
  rating: Number,
  policeNum: {
    type: Number,
    default: 0,
  },
});

const imagesModel = core.mongoose.model('images', imagesSchema);

module.exports.imagesModel = imagesModel;
