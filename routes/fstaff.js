const express = require("express");
const route = express.Router();
const notiController = require('../controllers/notiController');
const eventController = require('../controllers/eventController');

route.get('/', notiController.viewHome);

// This is for Thông báo
route.get('/list-noti', notiController.viewNotification);
route.get('/add-noti', notiController.viewAddNotification);
route.post('/add-noti', notiController.addNotification);
route.get('/noti/edit-noti/:id', notiController.viewEditNoti);
route.post('/noti/edit-noti/:id', notiController.editNoti);
route.get('/noti/delete-noti/:id', notiController.deleteNoti);
route.get('/noti/status-on/:id', notiController.statusOn);
route.get('/noti/status-off/:id', notiController.statusOff);

// This is for Sự kiện
route.get('/list-event', eventController.viewEvet);
route.get('/add-event', eventController.viewAddEvent);
route.post('/add-event', eventController.addEvent);
route.get('/event/edit-event/:id', eventController.viewEditEvent);
route.post('/event/edit-event/:id', eventController.editEvent);
route.get('/event/delete-event/:id', eventController.deleteEvent);
route.get('/event/status-on/:id', eventController.statusOn);
route.get('/event/status-off/:id', eventController.statusOff);


module.exports = route;