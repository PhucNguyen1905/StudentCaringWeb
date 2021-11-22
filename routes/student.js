const express = require("express");
const route = express.Router();
const studentController = require('../controllers/studentController');
const homepageController = require('../controllers/homapageController');
const auth = require('../config/auth');
const student_authController = require('../controllers/student_authController');
const isStudent = auth.isStudent;

// Homepage for any role
route.get('/', homepageController.viewHome);


// View index page
route.get('/index', isStudent, studentController.viewIndex);

// This is for Contact function
route.get('/contact', isStudent, studentController.viewContact);
route.post('/chat/send-mess/:id', studentController.sendMessage);
route.get('/chat', isStudent, studentController.viewChat);
route.get('/chat/detail/:id', isStudent, studentController.viewChatByID);

// This is for Event function
route.get('/event', isStudent, studentController.viewEvent)
route.get('/student-event', isStudent, studentController.viewMyEvent)
route.get('/register-event/:id', isStudent, studentController.registerEvent);

// This is for Đăng ký function
route.get('/print', isStudent, studentController.viewPrint);
route.post('/print', studentController.onPrint);

//this is for giảm học phí
route.get('/reduce-tuition', isStudent, studentController.viewReduceTuition);
route.post('/reduce-tuition', studentController.onReduceTuition);

//for feedback
route.get('/feedback', isStudent, studentController.viewFeedBackPage);
route.post('/feedback', studentController.sendFeedback);

//for edit thong tin
route.get('/edit-info', isStudent, studentController.viewUpdateInfo);
route.post('/edit-info-student', studentController.updateInfo);
route.post('/onAddDependent', studentController.addDependent);

//for reply
route.get('/reply-detail-:id', isStudent, studentController.viewReply);
route.get('/hide-reply-:id', isStudent, studentController.hideReply);





// This is for Logon - Logout
route.get('/login', student_authController.viewLogin)
route.post('/login', student_authController.login)
route.get('/logout', student_authController.logout);

module.exports = route;