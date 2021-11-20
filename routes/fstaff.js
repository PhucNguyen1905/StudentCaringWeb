const express = require("express");
const route = express.Router();
const notiController = require('../controllers/notiController');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/staff_authController');
const auth = require('../config/auth');
const isStaff = auth.isStaff;

route.get('/', isStaff, notiController.viewHome);

// This is for Thông báo
route.get('/list-noti', isStaff, notiController.viewNotification);
route.get('/add-noti', isStaff, notiController.viewAddNotification);
route.post('/add-noti', notiController.addNotification);
route.get('/noti/edit-noti/:id', isStaff, notiController.viewEditNoti);
route.post('/noti/edit-noti/:id', notiController.editNoti);
route.get('/noti/delete-noti/:id', isStaff, notiController.deleteNoti);
route.get('/noti/status-on/:id', isStaff, notiController.statusOn);
route.get('/noti/status-off/:id', isStaff, notiController.statusOff);

// This is for Sự kiện
route.get('/list-event', isStaff, eventController.viewEvent);
route.get('/add-event', isStaff, eventController.viewAddEvent);
route.post('/add-event', eventController.addEvent);
route.get('/event/edit-event/:id', isStaff, eventController.viewEditEvent);
route.post('/event/edit-event/:id', eventController.editEvent);
route.get('/event/delete-event/:id', isStaff, eventController.deleteEvent);
route.get('/event/status-on/:id', isStaff, eventController.statusOn);
route.get('/event/status-off/:id', isStaff, eventController.statusOff);


// This is for Logon - Logout
route.get('/login', authController.viewLogin)
route.post('/login', authController.login)
route.get('/logout', authController.logout);


module.exports = route;