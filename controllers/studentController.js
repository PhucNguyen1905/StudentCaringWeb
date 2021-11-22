const mysql = require("mysql");

//Connection pool
const connection = mysql.createPool({
    connectionLimit: 100,
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

let STUDENT;

function convertDate(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

function getFacultyName(id) {
    switch (id) {
        case 1:
            return 'Khoa Học Máy Tính';
        case 2:
            return 'Điện - Điện tử';
        case 3:
            return 'Giao thông'
        case 4:
            return 'Kỹ thuật Hóa học'
    }
}

// GET Login
exports.viewLogin = (req, res) => {
    res.render('login')
}
exports.login = (req, res) => {
    res.render('login')
}

// Home page 
exports.viewIndex = (req, res) => {
    STUDENT = res.locals.user;
    //get reply email
    var sql = 'select * from reply where studentID = ? and seen = ?';
    connection.query(sql, [STUDENT.id, 0], (err, reply) => {
        if (err) throw err;
        connection.query('SELECT * FROM main_notification WHERE nstatus = "on" and etime > CURDATE()', (err, notis) => {
            // When done with the connection, release it
            if (!err) {
                res.render('index', {
                    title: 'Thông báo',
                    notis: notis,
                    reply: reply,
                    countReply: reply.length
                })
            } else {
                console.log(err);
            }

        });
    })
}

// Contact start here
exports.viewContact = (req, res) => {
    let sql = 'SELECT * FROM school_staff s JOIN consultant c ON s.ID =c.ID JOIN consulting_field ON s.ID = consultant_id; select * from reply where studentID = ? and seen = ?'
    connection.query(sql, [STUDENT.id, 0], (err, results) => {
        // When done with the connection, release it
        if (!err) {
            consultants = results[0];
            reply = results[1];
            res.render('contact', {
                title: 'Liên hệ',
                consultants: consultants,
                reply: reply,
                countReply: reply.length
            });
        } else {
            console.log(err);
        }

    });

}
// POST send message
exports.sendMessage = (req, res) => {
    let consID = req.params.id;
    let content = req.body.content;
    let stuID = STUDENT.id;
    let sql = 'INSERT INTO contents(Consultant_ID, student_id, content, qoa) VALUES (?,?,?,?)';
    connection.query(sql, [consID, stuID, content, 0], (err, resul) => {
        // When done with the connection, release it
        if (err) throw err;
        let conSql = 'SELECT * FROM school_staff s WHERE s.ID IN (SELECT Consultant_ID FROM contents WHERE student_id = ? ORDER BY id DESC)'
        connection.query(conSql, [stuID], (error, consultants) => {
            // When done with the connection, release it
            if (error) throw error;
            let latestConsID = consID;
            let messSql = 'SELECT * FROM contents WHERE student_id = ? AND Consultant_ID = ?; SELECT * FROM school_staff WHERE ID = ?;select * from reply where studentID = ? and seen = ?'
            connection.query(messSql, [stuID, latestConsID, consID, STUDENT.id, 0], (err, results) => {
                if (err) throw err;
                messages = results[0];
                detailConsultants = results[1];
                reply = results[2];
                res.render('chat_id', {
                    title: 'Tin nhắn',
                    user: STUDENT,
                    consultants: consultants,
                    messages: messages,
                    detailConsultant: detailConsultants[0],
                    convertDate: convertDate,
                    reply: reply,
                    countReply: reply.length
                })
            })

        });

    });

}

exports.viewChat = (req, res) => {
    let stuID = STUDENT.id;
    let conSql = 'SELECT * FROM school_staff s JOIN consultant c ON s.ID = c.id AND s.ID IN (SELECT Consultant_ID FROM contents WHERE student_id = ? ORDER BY id DESC)'
    connection.query(conSql, [stuID], (error, consultants) => {
        // When done with the connection, release it
        if (error) throw error;
        let latestConsID = consultants[0].id;
        let messSql = 'SELECT * FROM contents WHERE student_id = ? AND Consultant_ID = ?; select * from reply where studentID = ? and seen = ?'
        connection.query(messSql, [stuID, latestConsID, STUDENT.id, 0], (err, results) => {
            if (err) throw err;
            messsages = results[0];
            reply = results[1];
            res.render('chat', {
                title: 'Tin nhắn',
                user: STUDENT,
                consultants: consultants,
                messages: messsages,
                convertDate: convertDate,
                reply: reply,
                countReply: reply.length
            })
        })

    });


}

exports.viewChatByID = (req, res) => {
    let consID = parseInt(req.params.id);
    let stuID = STUDENT.id;
    let conSql = 'SELECT * FROM school_staff s WHERE s.ID IN (SELECT Consultant_ID FROM contents WHERE student_id = ? ORDER BY id DESC)'
    connection.query(conSql, [stuID], (error, consultants) => {
        // When done with the connection, release it
        if (error) throw error;
        let latestConsID = consID;
        let messSql = 'SELECT * FROM contents WHERE student_id = ? AND Consultant_ID = ?; SELECT * FROM school_staff WHERE ID = ?;select * from reply where studentID = ? and seen = ?'
        connection.query(messSql, [stuID, latestConsID, consID, STUDENT.id, 0], (err, results) => {
            if (err) throw err;
            messages = results[0];
            detailConsultants = results[1];
            reply = results[2];
            res.render('chat_id', {
                title: 'Tin nhắn',
                user: STUDENT,
                consultants: consultants,
                messages: messages,
                detailConsultant: detailConsultants[0],
                convertDate: convertDate,
                reply: reply,
                countReply: reply.length
            })
        })

    });


}


// Event start here
exports.viewEvent = (req, res) => {
    connection.query('SELECT * FROM event WHERE status = "on" AND etime > CURDATE(); select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, results) => {
        // When done with the connection, release it
        if (!err) {
            events = results[0];
            reply = results[1];
            res.render('event', {
                title: 'Sự kiện',
                events: events,
                hidden: 'hidden',
                message: '',
                reply: reply,
                countReply: reply.length
            })
        } else {
            console.log(err);
        }

    });

}
exports.viewMyEvent = (req, res) => {
    let stuID = STUDENT.id;
    let sql = 'SELECT * FROM event WHERE id IN (SELECT Event_ID FROM register WHERE StudentID = ?);select * from reply where studentID = ? and seen = ?';
    connection.query(sql, [stuID, stuID, 0], (err, results) => {
        if (err) throw err;
        events = results[0];
        reply = results[1];
        res.render('myevent', {
            title: 'Sự kiện của tôi',
            events: events,
            convertDate: convertDate,
            reply: reply,
            countReply: reply.length
        })
    })


}
exports.registerEvent = (req, res) => {
    let eventID = req.params.id;
    let stuID = STUDENT.id;
    let sql = 'INSERT INTO register(StudentID, Event_ID) VALUES (?,?)'
    connection.query(sql, [stuID, eventID], (err, results) => {
        if (err) throw err;
        connection.query('SELECT * FROM event WHERE status = "on" AND etime > CURDATE();select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, results) => {
            // When done with the connection, release it
            if (!err) {
                events = results[0];
                reply = results[1];
                res.render('event', {
                    title: 'Sự kiện',
                    events: events,
                    hidden: '',
                    message: 'Đã đăng ký sự kiện',
                    reply: reply,
                    countReply: reply.length
                })
            } else {
                console.log(err);
            }

        });
    })
}


// Request start here
exports.viewPrint = (req, res) => {
    //lấy thông tin các yêu cầu mà sinh viên đã gửi
    var requestNumber;
    var requestData;
    var sql1 = 'SELECT * FROM document_request WHERE studentID = ?';
    connection.query(sql1, [STUDENT.id], (err, data1) => {
        if (err) throw err;
        requestData = data1;
        requestNumber = data1.length;
    })

    //lấy thông tin khoa của sv
    var sql = 'SELECT * FROM faculty WHERE ID = ?';
    connection.query(sql, [STUDENT.Faculty_ID], (err, facultyData) => {
        if (err) throw err;
        connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
            if (err) throw err;
            res.render('print_document', {
                title: 'In giấy tờ',
                user: STUDENT,
                facultyData: facultyData[0],
                //requestInfo: requestInfo,
                requestData: requestData,
                requestNumber: requestNumber,
                reply: reply,
                countReply: reply.length
            })
        })
    })
}

exports.onPrint = (req, res) => {
    //lấy thông tin khoa
    console.log(STUDENT)
    var faculty_info;
    var sql_1 = 'SELECT * FROM faculty WHERE ID = ?';
    connection.query(sql_1, [STUDENT.Faculty_ID], (err, facultyData) => {
        if (err) throw err;
        faculty_info = facultyData;
    })

    //lấy thông tin người dùng
    var docType = req.body.docType;
    var rname = req.body.rname;
    var rphone = req.body.rphone;
    var raddress = req.body.raddress;
    var requestNumber;
    var requestData;
    //insert vào database
    var sql = 'INSERT INTO document_request(studentID, fullname, docType, rname, rphone, raddress, status) VALUES (?,?,?,?,?,?,?)';
    if (docType != null && rname != null && rphone != null && raddress != null) {
        connection.query(sql, [STUDENT.id, STUDENT.lname + ' ' + STUDENT.fname, docType, rname, rphone, raddress, `Đang chờ`], (err, data) => {
            if (err) throw err;
            //cập nhật thông tin các yêu cầu mà sinh viên đã gửi

            var sql1 = 'SELECT * FROM document_request WHERE studentID = ?';
            connection.query(sql1, [STUDENT.id], (err, data1) => {
                if (err) throw err;
                requestData = data1;
                requestNumber = data1.length;
                connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
                    if (err) throw err;
                    //load lại trang với thông tin mới
                    res.render('print_document', {
                        title: 'In giấy tờ',
                        user: STUDENT,
                        facultyData: faculty_info[0],
                        requestData: requestData,
                        requestNumber: requestNumber,
                        reply: reply,
                        countReply: reply.length
                    })
                })
            })


        })
    } else res.send('Hãy nhập đầy đủ nội dung.')
}

exports.viewReduceTuition = (req, res) => {
    //lấy thông tin các yêu cầu giảm học phí
    var sql1 = 'select * from request where (studentID = ?) and (type = ?)';
    connection.query(sql1, [STUDENT.id, `Giảm học phí`], (err, data1) => {
        if (err) throw err;
        connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
            if (err) throw err;
            res.render('reduceTuition', {
                title: 'Miễn giảm học phí',
                user: STUDENT,
                requestData: data1,
                requestNumber: data1.length,
                reply: reply,
                countReply: reply.length
            });
        })
    })
}

exports.onReduceTuition = (req, res) => {
    //lấy thông tin
    var fullName = STUDENT.lname + ' ' + STUDENT.fname;
    var mssv = STUDENT.id;
    var title = req.body.title;
    var phone = req.body.phoneNumber;
    var content = req.body.content;
    //thêm vào csdl
    if (fullName != null && mssv != null && title != null && phone != null && content != null) {
        var sql = 'INSERT INTO request(studentID, fullname, content, Type, rstatus, title) values (?, ?, ?, ?, ?, ?)';
        connection.query(sql, [STUDENT.id, STUDENT.lname + ' ' + STUDENT.fname, content, 'Giảm học phí', 'Đang chờ', title], (err, data) => {
            if (err) throw err;
            //cập nhật lại thông tin vừa thêm
            var sql1 = 'select * from request where (studentID = ?) and (type = ?)';
            connection.query(sql1, [STUDENT.id, `Giảm học phí`], (err, data1) => {
                if (err) throw err;
                connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
                    if (err) throw err;
                    res.render('reduceTuition', {
                        title: 'Miễn giảm học phí',
                        user: STUDENT,
                        requestData: data1,
                        requestNumber: data1.length,
                        reply: reply,
                        countReply: reply.length
                    });
                })
            })
        })
    } else res.send('Hãy nhập đầy đủ nội dung');
}

exports.viewFeedBackPage = (req, res) => {
    connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
        if (err) throw err;
        res.render('feedBackPage', {
            title: 'Phản ánh chất lượng',
            user: STUDENT,
            reply: reply,
            countReply: reply.length
        });
    })
}

exports.sendFeedback = (req, res) => {
    var mssv = STUDENT.id;
    var title = req.body.title;
    var content = req.body.content;
    if (mssv != null && title != null && content != null) {
        var sql = 'INSERT INTO feedback(studentID, fullname, title, contents) values (?, ?, ?, ?)';
        connection.query(sql, [STUDENT.id, STUDENT.lname + ' ' + STUDENT.fname, title, content], (err, data) => {
            if (err) throw err;
        })
        connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
            if (err) throw err;
            res.render('feedBackPage', {
                title: 'Phản ánh chất lượng',
                user: STUDENT,
                reply: reply,
                countReply: reply.length
            })
        })
    } else res.send('Hãy nhập đầy đủ nội dung');
}

exports.viewUpdateInfo = (req, res) => {
    connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
        if (err) throw err;
        res.render('updateInfo', {
            title: 'Chỉnh sửa thông tin',
            user: STUDENT,
            reply: reply,
            countReply: reply.length
        });
    })
}

exports.updateInfo = (req, res) => {
    var phone = req.body.phone;
    var sonha = req.body.houseNumber;
    var street = req.body.street;
    var province = req.body.province;
    var photo = req.body.photo;
    if (phone != null && sonha != null && street != null && province != null && photo != null) {
        var sql = 'insert into student_phone values(?,?);';
        connection.query(sql, [STUDENT.id, phone], (err, data) => {
            if (err) throw err;
        })
        var sql1 = 'update student set ApartmentNumber = ?, Street = ?, province = ? where id = ?;';
        connection.query(sql1, [sonha, street, province, STUDENT.id], (err, data) => {
            if (err) throw err;
        })
        var sql2 = 'update student set avatarURL = ?';
        connection.query(sql2, [photo], (err, data) => {
            if (err) throw err;
        })
        connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
            if (err) throw err;
            res.render('updateInfo', {
                title: 'Thông báo',
                user: STUDENT,
                reply: reply,
                countReply: reply.length
            });
        })
    } else res.send('Hãy điền đầy đủ thông tin');
}

exports.addDependent = (req, res) => {
    var name = req.body.dfullname;
    var phone = req.body.dphone;
    var relation = req.body.drelation;
    var houseNumber = req.body.dhouseNumber;
    var street = req.body.dstreet;
    var province = req.body.dprovince;
    if (name != null && phone != null && relation != null && houseNumber != null && street != null && province != null) {
        var sql = 'insert into parents values (?,?,?,?);';
        connection.query(sql, [STUDENT.id, name, houseNumber + ', ' + street + ', ' + province, relation], (err, data) => {
            if (err) throw err;
        })
        sql = 'insert into parent_phone values (?,?,?);';
        connection.query(sql, [STUDENT.id, name, phone], (err, data) => {
            if (err) throw err;
        })
        connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
            if (err) throw err;
            res.render('updateInfo', {
                title: 'Thông báo',
                user: STUDENT,
                reply: reply,
                countReply: reply.length
            });
        })
    } else res.send('Hãy nhập đầy đủ thông tin.');
}

exports.viewReply = (req, res) => {
    //get reply id
    var replyID = req.params.id;
    //lấy tất cả reply
    connection.query('select * from reply where studentID = ? and seen = ?', [STUDENT.id, 0], (err, reply) => {
        if (err) throw err;
        //lấy reply đang cần xem
        connection.query('select * from reply where id = ?', [replyID], (err, data) => {
            res.render('replyDetail', {
                title: 'Thông báo',
                user: STUDENT,
                reply: reply,
                countReply: reply.length,
                currentReply: data[0]
            });

        })
    })
}

exports.hideReply = (req, res) => {
    //get reply id
    var replyID = req.params.id;
    var sql = 'update reply set seen = 1 where id = ?';
    connection.query(sql, [replyID], (err, data) => {
        if (err) throw err;
        //về trang chủ
        //get reply email
        var sql = 'select * from reply where studentID = ? and seen = ?';
        connection.query(sql, [STUDENT.id, 0], (err, reply) => {
            if (err) throw err;
            connection.query('SELECT * FROM main_notification WHERE nstatus = "on" and etime > CURDATE()', (err, notis) => {
                // When done with the connection, release it
                if (!err) {
                    res.render('index', {
                        title: 'Thông báo',
                        notis: notis,
                        reply: reply,
                        countReply: reply.length
                    })
                } else {
                    console.log(err);
                }

            });
        })
    })
}