const mysql = require("mysql");

//Connection pool
const connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

let STAFF;

// This is for Sự kiện function
exports.viewEvent = (req, res) => {
    STAFF = res.locals.user;
    console.log(STAFF)
    connection.query('SELECT * FROM event', (err, events) => {
        // When done with the connection, release it
        if (!err) {
            res.render('staff/list_event', {
                title: 'Danh sách sự kiện',
                hidden: 'hidden',
                message: '',
                events: events
            })
        } else {
            console.log(err);
        }

    });

}

exports.viewAddEvent = (req, res) => {
    res.render('staff/add_event', {
        title: 'Thêm sự kiện mới'
    })
}

// POST add event
exports.addEvent = (req, res) => {
    const title = req.body.title;
    const forwho = req.body.forwho;
    const time_happen = req.body.time_happen;
    const etime = req.body.etime;
    const content = req.body.content;
    const image_url = req.body.image_url;
    const sql = 'INSERT INTO event(title, forwho, time_happen, etime, content, image_url, FACULTYSTAFF_ID) VALUES(?,?,?,?,?,?,?)';
    connection.query(sql, [title, forwho, time_happen, etime, content, image_url, 1], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM event', (err, events) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_event', {
                        title: 'Danh sách sự kiện',
                        hidden: '',
                        message: 'Sự kiện đã được đăng tải',
                        events: events,
                        user: STAFF
                    })
                } else {
                    console.log(err);
                }

            });
        } else {
            console.log(error);
        }
    })

}
// View Edit event
exports.viewEditEvent = (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM event WHERE id = ?', [id], (err, events) => {
        // When done with the connection, release it
        if (!err) {
            res.render('staff/edit_event', {
                title: 'Chỉnh sửa sự kiện',
                event: events[0]
            })
        } else {
            console.log(err);
        }
    });

}
// POST edit event
exports.editEvent = (req, res) => {
    let id = req.params.id;
    const title = req.body.title;
    const forwho = req.body.forwho;
    const time_happen = req.body.time_happen;
    const etime = req.body.etime;
    const content = req.body.content;
    const image_url = req.body.image_url;
    const sql = 'UPDATE event set title = ?, forwho = ?, time_happen = ?, etime = ?, content = ?, image_url = ? WHERE id = ?'
    connection.query(sql, [title, forwho, time_happen, etime, content, image_url, id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM event', (err, events) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_event', {
                        title: 'Danh sách sự kiện',
                        hidden: '',
                        message: 'Sự kiện đã được cập nhật',
                        events: events,
                        user: STAFF
                    })
                } else {
                    console.log(err);
                }

            });
        } else {
            console.log(error);
        }

    });


}
// Delete event
exports.deleteEvent = (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM event WHERE id = ?', [id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM event', (err, events) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_event', {
                        title: 'Danh sách sự kiện',
                        hidden: '',
                        message: 'Đã xóa một sự kiện',
                        events: events
                    })
                } else {
                    console.log(err);
                }

            });
        } else {
            console.log(error);
        }
    });
}
// GET status ON
exports.statusOn = (req, res) => {
    let status = 'on';
    let id = req.params.id;
    connection.query('UPDATE event SET status = ? WHERE id = ?', [status, id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM event', (err, events) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_event', {
                        title: 'Danh sách sự kiện',
                        hidden: '',
                        message: 'Sự kiện đã được hiển thị',
                        events: events
                    })
                } else {
                    console.log(err);
                }

            });
        } else {
            console.log(error);
        }
    });
}
// GET status OFF
exports.statusOff = (req, res) => {
    let status = 'off';
    let id = req.params.id;
    connection.query('UPDATE event SET status = ? WHERE id = ?', [status, id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM event', (err, events) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_event', {
                        title: 'Danh sách sự kiện',
                        hidden: '',
                        message: 'Đã ẩn một sự kiện',
                        events: events
                    })
                } else {
                    console.log(err);
                }

            });
        } else {
            console.log(error);
        }
    });
}






