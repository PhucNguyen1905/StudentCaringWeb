const express = require("express");
const route = express.Router();
const consulController = require('../controllers/consulController');
const internController = require('../controllers/internController');
const authController = require('../controllers/consul_authController');
const auth = require('../config/auth');
const isConsul = auth.isConsul;

route.get('/', isConsul, consulController.viewHome);

// This is for Thông báo
route.get('/list-intern', isConsul, internController.viewIntern);
route.get('/add-intern', isConsul, internController.viewAddIntern);
route.post('/add-intern', internController.addIntern);
route.get('/intern/edit-intern/:id', isConsul, internController.viewEditIntern);
route.post('/intern/edit-intern/:id', internController.editIntern);
route.get('/intern/delete-intern/:id', isConsul, internController.deleteIntern);
route.get('/intern/status-on/:id', isConsul, internController.statusOn);
route.get('/intern/status-off/:id', isConsul, internController.statusOff);


// This is for Contact function
route.get('/chat', consulController.viewChat);
route.post('/chat/send-mess/:id', consulController.sendMessage);
route.get('/chat/detail/:id', consulController.viewChatByID);



// This is for Logon - Logout
route.get('/login', authController.viewLogin)
route.post('/login', authController.login)
route.get('/logout', authController.logout);


module.exports = route;