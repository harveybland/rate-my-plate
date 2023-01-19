const core = require('../core');
const schemas = require('../schemas/imageSchema');

const multer = require('multer');
const ObjectId = require('mongodb').ObjectId;
const fs = require('file-system');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

var upload = multer({ storage: storage });

// Post a photo
core.app.post(
  '/api/uploadphoto',
  upload.single('myImage'),
  async (req, res) => {
    try {
      var img = fs.readFileSync(req.file.path);
      var encode_image = img.toString('base64');

      const result = await schemas.imagesModel.create({
        contentType: req.file.mimetype,
        image: Buffer.from(encode_image, 'base64'),
        rating: 0,
        policeNum: 0,
      });

      let string = JSON.stringify(result);
      let objectV = JSON.parse(string);

      // console.log(objectV['_id']);

      res.status(200).json(objectV['_id']);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// Get photos
core.app.get('/api/photos', async (req, res) => {
  const images = await schemas.imagesModel.find();
  const help = images.map((item) => {
    let model = {
      id: item._id,
      rating: item.rating,
      policeNum: item.policeNum,
    };
    return model;
  });

  res.status(200).json(help);
});

core.app.get('/api/allphotos', async (req, resp) => {
  try {
    const images = await schemas.imagesModel.find();
    resp.status(200).json(images[0]);
  } catch {
    resp.status('404').json('error');
  }
});

// Add the photo
core.app.get('/api/photo/:id', (req, res) => {
  var filename = req.params.id;
  const image = schemas.imagesModel.findOne(
    { _id: ObjectId(filename) },
    (err, result) => {
      if (err) {
        return console.log(err);
      }

      var buffer = Buffer.from(new Uint8Array(result.image.buffer));
      res.contentType('image/jpeg');
      res.status(200).send(buffer);
    }
  );
});

// Get my photo
core.app.get('/api/myphoto/:uid', async (req, res) => {
  try {
    const image = await schemas.imagesModel.aggregate([
      {
        $match: {
          _id: core.mongoose.Types.ObjectId(req.params.uid),
        },
      },
    ]);
    res.status(200).json(image[0]);
  } catch {
    res.status(404).json('error');
  }
});

core.app.put('/api/rate/:uid', async (req, res) => {
  try {
    const id = req.params.uid;
    let rate = await schemas.imagesModel.findOne({ _id: id });
    let newRate = rate.rating + req.body.rating;
    (rate.rating = newRate), rate.save();
    const images = await schemas.imagesModel.find();
    res.status(200).json(images);
  } catch {
    res.status(404).json('error');
  }
});

// delete photo
core.app.delete('/api/myphoto/:uid', async (req, res) => {
  try {
    const id = req.params.uid;
    await schemas.imagesModel.deleteOne({ _id: id });
    const photo = await schemas.imagesModel.find();
    res.status(200).json('Success');
  } catch {
    res.status(404).json('error');
  }
});
