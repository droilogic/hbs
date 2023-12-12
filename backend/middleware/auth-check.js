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
    const encodedToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(encodedToken, OWN_SALT);
    req.userAuthData = {
      userId: decodedToken.userId,
      name: decodedToken.name,
      email: decodedToken.email,
      roleId: decodedToken.roleId,
      acclvl: decodedToken.acclvl
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      msgId: "FAILED",
      msgDescr: "FAILED: unauthorized; invalid email and/or password.",
      data: null
    });
  }
}