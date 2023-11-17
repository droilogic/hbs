const express = require('express');
const multer = require('multer');

// import schemas, models
const Hotel = require('../models/hotel');


const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/bmp": "bmp"
}

const storage = multer.diskStorage({
  "destination": (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid MIME type");
    if (isValid) {
      err = null;
    }
    cb(err, "backend/images");
  },
  "filename": (rew, file, cb) => {
    const fname = file.originalname.toLowerCase().split(" ").join("-") + "_" + Date.now() + "." + MIME_TYPE_MAP[file.mimetype];
    cb(null, fname);
  }
});


// POST
router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  // our server URL
  const url = req.protocol + "://" + req.get("host");

  const hotel = Hotel({
    rv: 0,
    name: req.body.name,
    email: req.body.email,
    img: url + "/images/" + req.file.filename,
    address: req.body.address,
    phone: req.body.phone,
    rooms: req.body.rooms,
    owner_id: "",
    comments: req.body.comments
  });
  hotel.save().then(hotel => {
    res.status(201).json({
      msgId: "ADDED",
      msgDescr: "ADDED " + hotel._id,
      data: hotel
    });
  });

});


// PUT
router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {

  //console.log("req.body.img: " + req.body.img + "\nreq.file.filename: " + req.file?.filename);

  // check if we got a new file
  let imagePath = req.body.img;
  if (req.file) {
    // our server URL
    const url = req.protocol + "://" + req.get("host");
    // we got a new file, update image path
    imagePath = url + "/images/" + req.file.filename;
    console.log("backend.hotels.router.put: new file detected (" + req.file.filename + "), new URL: " + imagePath);
  }

  const currrv = req.body.rv;
  const newrv = currrv + 1;
  console.log("newrv: ", newrv);
  const hotel = new Hotel({
    _id: req.body.id,
    rv: newrv,
    name: req.body.name,
    img: imagePath,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    rooms: req.body.rooms,
    owner_id: "",
    comments: req.body.comments
  });

  console.log("Hotel.Router.put.hotel: " + hotel);
  filter = {}
  filter["_id"] = {"$eq": req.body.id};
  filter["rv"] = {"$eq": currrv};

  Hotel.updateOne(filter, hotel).then(result => {
    console.log(result);
    res.status(200).json({
      msgId: "UPDATED",
      msgDescr: "UPDATED " + hotel._id,
      data: hotel._id
    });
  })
});


// DELETE
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Hotel.deleteOne({ _id: id })
    .then(result => {
      console.log(result);
      console.log("hotel deleted");
      res.status(200).json({
        msgId: "DELETED",
        msgDescr: "DELETED " + id,
        data: id
      });
    });
});

// GET
router.get("", (req, res, next) => {
  Hotel.find().then(docs => {
    // INFO: send response goes here since this is an async call
    res.status(200).json({
      msgId: 'OK',
      msgDescr: 'OK',
      data: docs
    });
  });

});


// GET
router.get("/:id", (req, res, next) => {
  Hotel.findById(req.params.id).then(doc => {

    // INFO: send response goes here since this is an async call
    if (doc) {
      res.status(200).json({
        msgId: 'OK',
        msgDescr: 'OK',
        data: doc
      });
    } else {
      res.status(404).json({
        msgId: 'NOT_FOUND',
        msgDescr: 'Hotel not found',
        data: null
      });
    }
  });

});


module.exports = router;
