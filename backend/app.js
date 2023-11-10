require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import schemas, models
const Employee = require('./models/employee');
const Manager = require('./models/manager');

const app = express();

// get environment variables
const db_url = process.env.DB_URL;

mongoose.connect(db_url)
  .then(() => {
    console.log("connected to DB!");
  })
  .catch(() => {
    console.log("ERROR connecting to DB!");
  });

// middleware: body parser, URL encoding
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// middleware: CORS
app.use((req, res, next) => {
  // allow access to backend from EVERY source (domain)
  // CAUTION: this is not good policy for production environment!
  res.setHeader("Access-Control-Allow-Origin", "*");
  // block requests not containing the following headers
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // verbs allowed
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});





// POST
app.post("/api/employees", (req, res, next) => {
  // const employee = req.body;
  const employee = Employee({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
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

// DELETE
app.delete("/api/employees/:id", (req, res, next) => {
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
app.get("/api/employees", (req, res, next) => {
  Employee.find().then(docs => {
    // INFO: send response goes here since this is an async call
    res.status(200).json({
      msgId: 'OK',
      msgDescr: 'OK',
      data: docs
    });
  });

});


module.exports = app;
