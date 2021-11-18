const express = require("express");
const route = express.Router();
const staffController = require('../controllers/staffController');

route.get('/', staffController.viewHome);

// This is for Thông báo
route.get('/list-noti', staffController.viewNotification);
route.get('/add-noti', staffController.viewAddNotification);

// This is for Sự kiện
route.get('/list-event', staffController.viewEvet);
route.get('/add-event', staffController.viewAddEvent);

module.exports = route;