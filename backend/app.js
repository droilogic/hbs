require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import routes
const employeeRoutes = require('./routes/employees');
const Manager = require('./models/manager');


const app = express();

// get environment variables
const db_url = process.env.DB_URL;

mongoose.connect(db_url)
  .then(() => {
    console.log("established connection to DB");
  })
  .catch(() => {
    console.error("ERROR connecting to DB!");
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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

// register routes
app.use("/api/employees", employeeRoutes);

module.exports = app;
