require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");

// import routes
const employeeRoutes = require('./routes/employees');
const Manager = require('./models/manager');

// main app
const app = express();

// middleware: server protection
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.crossOriginEmbedderPolicy())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter())
app.use(helmet.originAgentCluster())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(helmet.crossOriginOpenerPolicy())

// get environment variables
const db_url = process.env.DB_URL;

mongoose.connect(db_url)
  .then(() => {
    console.log(now() + " established connection to DB");
  })
  .catch(() => {
    console.error(now() + "ERROR connecting to DB!");
  });

// middleware: body parser, URL encoding
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// middleware: CORS
app.use((req, res, next) => {
  // allow access to backend from our frontend only (domain)
  // CAUTION: careful of what is ALLOWED; server security can be compromised!
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  // block requests not containing the following headers
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // verbs allowed
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

// middleware: register routes
app.use("/api/employees", employeeRoutes);

// returns current date/time
function now() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

module.exports = app;
