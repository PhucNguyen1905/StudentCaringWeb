const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require("body-parser");
const passport = require('passport');

require("dotenv").config();

const app = express();

// Config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// // Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Passport config
require('./config/passport_student')(passport);
// Passport middlware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

// Router
const studentRoute = require('./routes/student');
const staffRoute = require('./routes/fstaff');

app.use('/staff', staffRoute);
app.use('/', studentRoute);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Running on port: " + port);
});
