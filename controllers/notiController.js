const mysql = require("mysql");

//Connection pool
const connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


exports.viewHome = (req, res) => {
    res.render('staff/staff_index', {
        title: 'Home'
    })
}


// This is for Thông báo function
exports.viewNotification = (req, res) => {
    connection.query('SELECT * FROM main_notification', (err, notis) => {
        // When done with the connection, release it
        if (!err) {
            res.render('staff/list_notification', {
                title: 'Danh sách thông báo',
                hidden: 'hidden',
                message: '',
                notis: notis
            })
        } else {
            console.log(err);
        }

    });
}
exports.viewAddNotification = (req, res) => {
    res.render('staff/add_notification', {
        title: 'Thêm thông báo mới'
    })
}
// POST add noti
exports.addNotification = (req, res) => {
    const title = req.body.title;
    const forwho = req.body.forwho;
    const time_happen = req.body.time_happen;
    const etime = req.body.etime;
    const content = req.body.content;
    const sql = 'INSERT INTO main_notification(title, forwho, time_happen, etime, content) VALUES(?,?,?,?,?)';
    connection.query(sql, [title, forwho, time_happen, etime, content], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM main_notification', (err, notis) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_notification', {
                        title: 'Danh sách thông báo',
                        hidden: '',
                        message: 'Thông báo đã được đăng tải',
                        notis: notis
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
// View Edit noti
exports.viewEditNoti = (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM main_notification WHERE id = ?', [id], (err, notis) => {
        // When done with the connection, release it
        if (!err) {
            res.render('staff/edit_notification', {
                title: 'Chỉnh sửa thông báo',
                noti: notis[0]
            })
        } else {
            console.log(err);
        }
    });

}
// POST edit noti
exports.editNoti = (req, res) => {
    let id = req.params.id;
    const title = req.body.title;
    const forwho = req.body.forwho;
    const time_happen = req.body.time_happen;
    const etime = req.body.etime;
    const content = req.body.content;
    const sql = 'UPDATE main_notification set title = ?, forwho = ?, time_happen = ?, etime = ?, content = ? WHERE id = ?'
    connection.query(sql, [title, forwho, time_happen, etime, content, id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM main_notification', (err, notis) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_notification', {
                        title: 'Danh sách thông báo',
                        hidden: '',
                        message: 'Thông báo đã được cập nhật',
                        notis: notis
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
// Delete noti
exports.deleteNoti = (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM main_notification WHERE id = ?', [id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM main_notification', (err, notis) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_notification', {
                        title: 'Danh sách thông báo',
                        hidden: '',
                        message: 'Đã xóa một thông báo',
                        notis: notis
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
    connection.query('UPDATE main_notification SET nstatus = ? WHERE id = ?', [status, id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM main_notification', (err, notis) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_notification', {
                        title: 'Danh sách thông báo',
                        hidden: '',
                        message: 'Thông báo đã được hiện lên trang chủ',
                        notis: notis
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
    connection.query('UPDATE main_notification SET nstatus = ? WHERE id = ?', [status, id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM main_notification', (err, notis) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('staff/list_notification', {
                        title: 'Danh sách thông báo',
                        hidden: '',
                        message: 'Thông báo đã được ẩn',
                        notis: notis
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



// This is for Sự kiện function
exports.viewEvet = (req, res) => {
    res.render('staff/list_event', {
        title: 'Danh sách sự kiện'
    })
}
exports.viewAddEvent = (req, res) => {
    res.render('staff/add_event', {
        title: 'Thêm sự kiện mới'
    })
}


