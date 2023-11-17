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
  // const hotel = req.body;
  const hotel = Hotel({
    rv: 0,
    name: req.body.name,
    email: req.body.email,
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
      data: hotel._id
    });
  });

});


// PUT
router.put("/:id", (req, res, next) => {
  const currrv = req.body.rv;
  const newrv = currrv + 1;
  const hotel = new Hotel({
    _id: req.body.id,
    rv: newrv,
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    rooms: req.body.rooms,
    owner_id: "",
    comments: req.body.comments
  });

  Hotel.updateOne({_id: hotel._id, rv: currrv }, hotel).then(result => {
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
  Employee.deleteOne({ _id: id })
    .then(result => {
      console.log(result);
      console.log("employee deleted");
      res.status(200).json({
        msgId: "DELETED",
        msgDescr: 'DELETED',
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
