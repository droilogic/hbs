require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import schemas, models
const User = require("../models/user");
const Role = require("../models/role");
const { filter } = require("rxjs");

// get environment variables
const OWN_SALT = process.env.OWN_SALT;


const router = express.Router();


// POST (user sign up route)
router.post("/signup", (req, res, next) => {
  // console.log("<AuthService.post> email: " + req.body.email + ", pwd: " + req.body.pwd + ", role: " + req.body.role_id);
  // data OK
  bcrypt
    .hash(req.body.pwd, 10)
    .then(hash => {
      const user = new User({
        rv: 0,
        email: req.body.email,
        password: hash,
        role_id: req.body.role_id,
        name: req.body.name,
        phone: req.body.phone,
        comments: req.body.comments
      });
      user.save()
        .then(u => {
          res.status(201).json({
            msgId: "ADDED",
            msgDescr: "ADDED " + u._id,
            data: u
          });
        })
        .catch(err => {
          console.error("ERROR: " + err);
          res.status(500).json({
            msgId: "FAILED",
            msgDescr: "FAILED: " + err.message,
            data: null
          });
        });
    });
});


// POST (user sign in/login route)
router.post("/signin", (req, res, next) => {

  let fetchedUser;
  let fetchedUserRole;

  // check if user exists
  User.findOne({ email: req.body.email }).then(user => {
    console.log("AuthService.post.signin> user: " + JSON.stringify(user));
    // data OK
    if (!user) {
      // user does not exist
      console.error("ERROR: unauthorized (" + req.body.email + ")");
      return res.status(401).json({
        msgId: "FAILED",
        msgDescr: "FAILED: unauthorized; invalid email and/or password.",
        data: null
      });
    }
    // arriving here means we have a user!
    fetchedUser = user;
    return bcrypt.compare(req.body.pwd, user.password);
  })
  .then(result => {
    console.log("AuthService.post.signin> userfound: " + result);
    // data OK
    if (!result) {
      console.error("ERROR: unauthorized (" + req.body.email + ")");
      return res.status(401).json({
        msgId: "FAILED",
        msgDescr: "FAILED: unauthorized; invalid email and/or password.",
        data: null
      });
    }
    // arriving here means we have a valid email/pwd combo!
    //
    // fetch user role
    // console.log("AuthService.post.signin> user.role_id: " + fetchedUser.role_id);
    // data OK
    Role.findOne({ _id: fetchedUser.role_id })
      .then(role => {
        fetchedUserRole = role;
        // create token
        const token = jwt.sign(
          { userId: fetchedUser._id, name: fetchedUser.name, email: fetchedUser.email, roleId: fetchedUser.role_id, acclvl: fetchedUserRole.acclvl },
          OWN_SALT,
          { expiresIn: "1h" }
        );
        console.log("AuthService.post.signin> user: " + fetchedUser._id + " (role: " + fetchedUserRole.descr + ") authenticated!");
        res.status(200).json({
          msgId: "OK",
          msgDescr: "AUTHENTICATON: success",
          data: token,
          userId: fetchedUser._id,
          userName: fetchedUser.name,
          roleId: fetchedUserRole._id,
          acclvl: fetchedUserRole.acclvl,
          expiresIn: 3600
        });
      })
      .catch(err => {
        console.error("ERROR: invalid or missing role for user " + fetchedUser._id);
        return res.status(404).json({
          msgId: "FAILED",
          msgDescr: "FAILED: invalid or missing role",
          data: null
        });
    });
  })
  .catch(err => {
    console.error("ERROR: unauthorized (" + req.body.email + ")");
    console.error(err);
    return res.status(401).json({
      msgId: "FAILED",
      msgDescr: "FAILED: unauthorized; (invalid email and/or password) OR (authService failure).",
      data: null
    });
});

});


// PUT (user edit route)
router.put("/:id", (req, res, next) => {
  console.log("<AuthService.edit> email: " + req.body.email + ", pwd: " + req.body.pwd + ", role: " + req.body.role_id + ", rv: " + req.body.rv);
  // data OK

  const currrv = parseInt(req.body.rv);
  const newrv = currrv + 1;
  console.log("<AuthService.edit> newrv: ", newrv);

  bcrypt
    .hash(req.body.pwd, 10)
    .then(hash => {
      const user = new User({
        _id: req.body.id,
        rv: newrv,
        email: req.body.email,
        password: hash,
        role_id: req.body.role_id,
        name: req.body.name,
        phone: req.body.phone,
        comments: req.body.comments
      });

      console.log("AuthService.edit.put.user: " + user);
      let filter = {}
      filter["_id"] = {"$eq": req.body.id};
      filter["rv"] = {"$eq": currrv};

      User.updateOne(filter, user).then(result => {
        console.log(result);
        res.status(200).json({
          msgId: "UPDATED",
          msgDescr: "UPDATED " + user._id,
          data: user._id
        });
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
  const query = User.find();
  if (pgSize && currPage) {
    // make sure both variables have valid values
    query.skip(pgSize * (currPage - 1)).limit(pgSize);
  }

  query
  .then(docs => {
    // store returned rows
    resultset = docs;
    return User.countDocuments();
  })
  .then(cnt => {
    // INFO: send response goes here since this is an async call
    res.status(200).json({
      msgId: "OK",
      msgDescr: "OK",
      cnt: cnt,
      data: resultset
    });
  });
});


// GET
router.get("/:id", (req, res, next) => {
  // handling pagination
  // hint: plus sign converts strings to numbers(!)
  let resultset;
  const pgSize = +req.query.ps;
  const currPage = +req.query.pg;

  let filter = {};
  filter["_id"] = {"$eq": req.params.id};
  // console.log("findOne filter: " + JSON.stringify(filter));

  const query = User.findOne(filter);
  if (pgSize && currPage) {
    // make sure both variables have valid values
    query.skip(pgSize * (currPage - 1)).limit(pgSize);
  }

  query
  .then(docs => {
    // store returned rows
    resultset = docs;
    return 1;
  })
  .then(cnt => {
    // INFO: send response goes here since this is an async call
    res.status(200).json({
      msgId: "OK",
      msgDescr: "OK",
      cnt: cnt,
      data: resultset
    });
  });
});



module.exports = router;
