'use strict';

const express = require('express');

const authenticateUser = require('../middleware/auth-user')

const Course = require('../models')
const User = require('../models')

// Construct a router instance.
const router = express.Router();

//middlware async function
function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    };
  }

  