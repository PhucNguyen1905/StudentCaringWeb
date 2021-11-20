const mysql = require("mysql");

//Connection pool
const connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

let CONSULTANT;

// This is for Thông báo function
exports.viewIntern = (req, res) => {
    CONSULTANT = res.locals.user;
    connection.query('SELECT * FROM main_notification', (err, notis) => {
        // When done with the connection, release it
        if (!err) {
            res.render('consultant/list_intern', {
                title: 'Danh sách việc làm',
                hidden: 'hidden',
                message: '',
                notis: notis
            })
        } else {
            console.log(err);
        }

    });
}
exports.viewAddIntern = (req, res) => {
    res.render('consultant/add_intern', {
        title: 'Thêm cơ hội việc làm'
    })
}
// POST add Intern
exports.addIntern = (req, res) => {
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
                    res.render('consultant/list_intern', {
                        title: 'Cơ hội việc làm',
                        hidden: '',
                        message: 'Cơ hội việc làm đã được đăng tải',
                        notis: notis,
                        user: CONSULTANT
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
// View Edit intern
exports.viewEditIntern = (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM main_notification WHERE id = ?', [id], (err, notis) => {
        // When done with the connection, release it
        if (!err) {
            res.render('consultant/edit_intern', {
                title: 'Chỉnh sửa việc làm',
                noti: notis[0]
            })
        } else {
            console.log(err);
        }
    });

}
// POST edit Intern
exports.editIntern = (req, res) => {
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
                    res.render('consultant/list_intern', {
                        title: 'Cơ hội việc làm',
                        hidden: '',
                        message: 'Cơ hội việc làm đã được cập nhật',
                        notis: notis,
                        user: CONSULTANT
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
// Delete Intern
exports.deleteIntern = (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM main_notification WHERE id = ?', [id], (error, result) => {
        // When done with the connection, release it
        if (!error) {
            connection.query('SELECT * FROM main_notification', (err, notis) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('consultant/list_intern', {
                        title: 'Cơ hội việc làm',
                        hidden: '',
                        message: 'Đã xóa một việc làm',
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
                    res.render('consultant/list_intern', {
                        title: 'Cơ hội việc làm',
                        hidden: '',
                        message: 'Việc làm đã được hiện lên trang chủ',
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
                    res.render('consultant/list_intern', {
                        title: 'Cơ hội việc làm',
                        hidden: '',
                        message: 'Việc làm đã được ẩn',
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




