const express = require('express');

// import schemas, models
const Booking = require('../models/booking');
// authentication middleware
const authCheck = require("../middleware/auth-check");


const router = express.Router();





// POST
router.post("", authCheck, (req, res, next) => {
  const booking = Booking({
    rv: 0,
    user_id: req.body.user_id,
    hotel_id: req.body.hotel_id,
    guest_name: req.body.guest_name,
    guest_email: req.body.guest_email,
    guest_address: req.body.guest_address,
    guest_phone: req.body.guest_phone,
    room: req.body.room,
    persons: req.body.persons,
    checkin: req.body.checkin,
    checkout: req.body.checkout,
    price: req.body.price,
    comments: req.body.comments
  });
  booking.save().then(booking => {
    res.status(201).json({
      msgId: "ADDED",
      msgDescr: "ADDED " + booking._id,
      data: booking
    });
  });

});


// PUT
router.put("/:id", authCheck, (req, res, next) => {
  const currrv = parseInt(req.body.rv);
  const newrv = currrv + 1;
  console.log("newrv: ", newrv);
  const booking = new Booking({
    _id: req.body.id,
    rv: newrv,
    user_id: req.body.user_id,
    hotel_id: req.body.hotel_id,
    guest_name: req.body.guest_name,
    guest_email: req.body.guest_email,
    guest_address: req.body.guest_address,
    guest_phone: req.body.guest_phone,
    room: req.body.room,
    persons: req.body.persons,
    checkin: req.body.checkin,
    checkout: req.body.checkout,
    price: req.body.price,
    comments: req.body.comments
  });

  console.log("Booking.Router.put: " + booking);
  filter = {}
  filter["_id"] = {"$eq": req.body.id};
  filter["rv"] = {"$eq": currrv};

  Booking.updateOne(filter, booking).then(result => {
    console.log(result);
    res.status(200).json({
      msgId: "UPDATED",
      msgDescr: "UPDATED " + booking._id,
      data: booking._id
    });
  })
});


// DELETE
router.delete("/:id", authCheck, (req, res, next) => {
  const id = req.params.id;
  Booking.deleteOne({ _id: id })
    .then(result => {
      console.log(result);
      console.log("booking deleted");
      res.status(200).json({
        msgId: "DELETED",
        msgDescr: "DELETED " + id,
        data: id
      });
    });
});


// GET
router.get("", authCheck, (req, res, next) => {
  // handling pagination
  // hint: plus sign converts strings to numbers(!)
  let resultset;
  const pgSize = +req.query.ps;
  const currPage = +req.query.pg;
  const query = Booking.find();
  if (pgSize && currPage) {
    // make sure both variables have valid values
    query.skip(pgSize * (currPage - 1)).limit(pgSize);
  }

  query
  .then(docs => {
    // store returned rows
    resultset = docs;
    return Booking.countDocuments();
  })
  .then(cnt => {
    // INFO: send response goes here since this is an async call
    res.status(200).json({
      msgId: 'OK',
      msgDescr: 'OK',
      cnt: cnt,
      data: resultset
    });
  });

});


// GET
router.get("/:id", authCheck, (req, res, next) => {
  Booking.findById(req.params.id).then(doc => {

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
        msgDescr: 'Booking not found',
        data: null
      });
    }
  });

});


module.exports = router;
