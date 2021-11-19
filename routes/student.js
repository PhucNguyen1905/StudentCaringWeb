const express = require("express");
const route = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../config/auth');
const student_authController = require('../controllers/student_authController');
const isStudent = auth.isStudent;

route.get('/', isStudent, studentController.viewHome);

// This is for Contact function
route.get('/contact', isStudent, studentController.viewContact);
route.get('/chat', studentController.viewChat);
// This is for Event function
route.get('/event', isStudent, studentController.viewEvent)
route.get('/student-event', isStudent, studentController.viewMyEvent)

// This is for Đăng ký function
route.get('/print', isStudent, studentController.viewPrint)

route.get('/reduce-tuition', isStudent, studentController.viewReduceTuition);
route.post('/onReduceTuition', studentController.onReduceTuition);

route.get('/feedback', isStudent, studentController.viewFeedBackPage);

route.get('/edit-info', isStudent, studentController.viewUpdateInfo);
route.post('/onUpdateInfo', studentController.updateInfo);
route.post('/onAddDependent', studentController.addDependent);





// This is for Logon - Logout
route.get('/login', student_authController.viewLogin)
route.post('/login', student_authController.login)
route.get('/logout', student_authController.logout);

module.exports = route;