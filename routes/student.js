const express = require("express");
const route = express.Router();
const studentController = require('../controllers/studentController');

route.get('/', studentController.viewHome);
route.get('/contact', studentController.viewContact);

module.exports = route;