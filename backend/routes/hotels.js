const express = require('express');
const multer = require('multer');

// import schemas, models
const Hotel = require('../models/hotel');
// authentication middleware
const authCheck = require("../middleware/auth-check");


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
router.post("", authCheck, multer({storage: storage}).single("image"), (req, res, next) => {
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
  hotel.save()
    .then(hotel => {
      res.status(201).json({
        msgId: "ADDED",
        msgDescr: "ADDED " + hotel._id,
        data: hotel
      });
    })
    .catch(err => {
      res.status(500).json({
        msgId: "FAILED",
        msgDescr: "FAILED: Unable to save object <" + hotel._id + ">",
        data: hotel
    });
  });

});


// PUT
router.put("/:id", authCheck, multer({storage: storage}).single("image"), (req, res, next) => {

  // check if we got a new file
  let imagePath = req.body.img;
  if (req.file) {
    // our server URL
    const url = req.protocol + "://" + req.get("host");
    // we got a new file, update image path
    imagePath = url + "/images/" + req.file.filename;
    console.log("backend.hotels.router.put: new file detected (" + req.file.filename + "), new URL: " + imagePath);
  }

  const currrv = parseInt(req.body.rv);
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

  Hotel.updateOne(filter, hotel)
    .then(result => {
      console.log(result);
      if (result.nModified > 0) {
        res.status(200).json({
          msgId: "UPDATED",
          msgDescr: "UPDATED " + hotel._id,
          data: hotel._id
        });
      } else {
        res.status(401).json({
          msgId: "FAILED",
          msgDescr: "FAILED: Unable to update object <" + hotel._id + ">",
          data: null
        });
      }
    })
    .catch(err => {
      res.status(500).json({
      msgId: "FAILED",
      msgDescr: "FAILED: Unable to update object <" + hotel._id + ">",
      data: null
    });
  });
});


// DELETE
router.delete("/:id", authCheck, (req, res, next) => {
  const id = req.params.id;
  Hotel.deleteOne({ _id: id })
    .then(result => {
      console.log(result);
      if (result.deletedCount > 0) {
        console.log("hotel deleted");
        res.status(200).json({
          msgId: "DELETED",
          msgDescr: "DELETED " + id,
          data: id
        });
      } else {
        console.log("hotel NOT deleted!");
        res.status(200).json({
          msgId: "FAILED",
          msgDescr: "FAILED: Unable to locate object <" + id + ">.",
          data: null
        });
      }

    })
    .catch(err => {
      res.status(500).json({
      msgId: "FAILED",
      msgDescr: "FAILED: Unable to delete object <" + id + ">",
      data: null
    });
  });
});

// GET
router.get("", (req, res, next) => {
  // handling pagination
  // hint: plus sign converts strings to numbers(!)
  let resultset;
  const pgSize = +req.query.ps;
  const currPage = +req.query.pg;
  const query = Hotel.find();
  if (pgSize && currPage) {
    // make sure both variables have valid values
    query.skip(pgSize * (currPage - 1)).limit(pgSize);
  }

  query
    .then(docs => {
      // store returned rows
      resultset = docs;
      return Hotel.countDocuments();
    })
    .then(cnt => {
      // INFO: send response goes here since this is an async call
      res.status(200).json({
        msgId: 'OK',
        msgDescr: 'OK',
        cnt: cnt,
        data: resultset
      });
    })
    .catch(err => {
      res.status(404).json({
      msgId: "NOT_FOUND",
      msgDescr: "NOT_FOUND: Unable to retrieve objects!",
      data: hotel
    });
  });
});


// GET
router.get("/:id", (req, res, next) => {
  Hotel.findById(req.params.id)
    .then(doc => {
      // INFO: send response goes here since this is an async call
      if (doc) {
        res.status(200).json({
          msgId: 'OK',
          msgDescr: 'OK',
          data: doc
        });
      } else {
        res.status(404).json({
          msgId: "NOT_FOUND",
          msgDescr: "NOT_FOUND: Hotel <" + req.params.id + "> not found!",
          data: null
        });
      }
    })
    .catch(err => {
      res.status(500).json({
      msgId: "NOT_FOUND",
      msgDescr: "NOT_FOUND: Hotel <" + req.params.id + "> not found!",
      data: null
    });
  });

});


module.exports = router;
