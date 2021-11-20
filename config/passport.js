const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mysql = require("mysql");

//Connection pool
const connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

module.exports = function (passport) {
    passport.use(new LocalStrategy(function (username, password, done) {
        connection.query('SELECT * FROM accounts WHERE Edu_mail = ?', [username], (err, accounts) => {
            if (err) throw err;
            if (accounts.length == 0)
                return done(null, false, { message: 'No user found!' });
            bcrypt.compare(password, accounts[0].password, function (err, isMatch) {
                if (err) throw err;
                if (password == accounts[0].password) {
                    return done(null, accounts[0])
                } else {
                    return done(null, false, { message: 'Wrong password' });
                }
            })
        })
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })
    passport.deserializeUser(function (id, done) {
        if (id > 1000) {
            connection.query('SELECT * FROM student WHERE id = ?', [id], (err, students) => {
                done(err, students[0]);
            })
        } else {
            connection.query('SELECT * FROM school_staff WHERE id = ?', [id], (err, staffs) => {
                done(err, staffs[0]);
            })
        }
    })


}