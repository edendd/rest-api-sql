"use strict";

const express = require("express");

const { authenticateUser } = require("../middleware/auth-user");

const Course = require("../models");
const User = require("../models");

// Construct a router instance.
const router = express.Router();

//middlware async function
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// Route that returns a list of courses
router.get(
  "/api/courses",
  asyncHandler(async (res, req) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "owner",
        },
      ],
    });

    if (courses) {
      res.json(courses);
      res.status(200);
    } else {
      res.status(404).json({ message: "we couln't find that course" });
    }
  })
);

// Route that returns a specific of courses
router.get(
  "/api/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "owner",
        },
      ],
    });

    if (course) {
      res.json(course);
      res.status(200);
    } else {
      res.status(404).json({ message: "we couldn't find that course" });
    }
  })
);

// route that helps to create a new course
router.put('/', authenticateUser, asyncHandler(async (req, res) => {
try{
const course = await Course.create(req.body)
res.status(201).location('api/courses/' + course.id).end();
} catch{
res.status(400).json({message: 'Please provide the course information.'})
  }
}));

