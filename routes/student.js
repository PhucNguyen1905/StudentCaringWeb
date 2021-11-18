const express = require("express");
const route = express.Router();
const studentController = require('../controllers/studentController');

route.get('/', studentController.viewHome);

// This is for Contact function
route.get('/contact', studentController.viewContact);

// This is for Event function
route.get('/event', studentController.viewEvent)
route.get('/student-event', studentController.viewMyEvent)

// This is for Đăng ký function
route.get('/print', studentController.viewPrint)

module.exports = route;