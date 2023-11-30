require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import schemas, models
const User = require("../models/user");

// get environment variables
const OWN_SALT = process.env.OWN_SALT;

module.exports = (req, res, next) => {
  try {
    // get the 2nd string of authorization payload
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, OWN_SALT);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      msgId: "FAILED",
      msgDescr: "FAILED: unauthorized.",
      data: null
    });
  }
}