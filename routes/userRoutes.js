'use strict';

const express = require('express');

const { authenticateUser } = require('../middleware/auth-user');

// Construct a router instance.
const router = express.Router();
const User = require('./models').User;

// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      // Forward error to the global error handler
      next(err);
    }
  }
}

// Route that returns a list of users.
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  res.json({
    firstName: user.firstName,
    lastNmae: user.lastName,
    emailAddress: user.emailAddress,
    password: user.password

  });
  res.status(200);
}));

// Route that creates a new user.
router.post('/', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.location('/');
    res.status(201).end();
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

module.exports = router;
