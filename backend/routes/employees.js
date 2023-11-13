const express = require('express');

// import schemas, models
const Employee = require('../models/employee');


const router = express.Router();

// POST (employee)
router.post("", (req, res, next) => {
  // const employee = req.body;
  const employee = Employee({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    manager_id: req.body.manager_id,
    comments: req.body.comments
  });
  employee.save().then(emp => {
    res.status(201).json({
      msgId: "ADDED",
      msgDescr: "ADDED " + emp._id,
      data: emp._id
    });
  });

});

// PUT (employee)
router.put("/:id", (req, res, next) => {
  const emp = new Employee({
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    manager_id: req.body.manager_id,
    comments: req.body.comments
  });

  Employee.updateOne({_id: emp._id }, emp).then(result => {
    console.log(result);
    res.status(200).json({
      msgId: "UPDATED",
      msgDescr: "UPDATED " + emp._id,
      data: emp._id
    });
  })
});

// DELETE (employee)
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

// GET (employees)
router.get("", (req, res, next) => {
  Employee.find().then(docs => {
    // INFO: send response goes here since this is an async call
    res.status(200).json({
      msgId: 'OK',
      msgDescr: 'OK',
      data: docs
    });
  });

});

// GET (employee)
router.get("/:id", (req, res, next) => {
  Employee.findById(req.params.id).then(doc => {

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
        msgDescr: 'Employee not found',
        data: null
      });
    }
  });

});


module.exports = router;
