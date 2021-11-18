const mysql = require("mysql");

//Connection pool
const connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

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
exports.viewHome = (req, res) => {
    connection.query('SELECT * FROM main_notification WHERE nstatus = "on" and etime > CURDATE()', (err, notis) => {
        // When done with the connection, release it
        if (!err) {
            res.render('index', {
                title: 'Thông báo',
                notis: notis
            })
        } else {
            console.log(err);
        }

    });
}

// Contact start here
exports.viewContact = (req, res) => {
    res.render('contact', {
        title: 'Liên hệ'
    });
}

// Event start here
exports.viewEvent = (req, res) => {
    connection.query('SELECT * FROM event WHERE status = "on" AND etime > CURDATE()', (err, events) => {
        // When done with the connection, release it
        if (!err) {
            res.render('event', {
                title: 'Sự kiện',
                events: events
            })
        } else {
            console.log(err);
        }

    });

}
exports.viewMyEvent = (req, res) => {
    res.render('student_event', {
        title: 'Sự kiện của tôi'
    })
}


// Request start here
exports.viewPrint = (req, res) => {
    res.render('print_document', {
        title: 'In giấy tờ',
        convertDate: convertDate,
        getFacultyName: getFacultyName
    });
}

exports.viewReduceTuition = (req, res) => {
    // var fullName = res.body.fullName;
    // var mssv = res.body.mssv;
    // var email = res.body.email;
    // var phone = res.body.phoneNumber;
    // var content = res.body.content;
    // if (fullName != null && mssv != null && email != null && phone != null && content != null) {
    //     var sql = 'INSERT INTO request(studentID, content, Type, status) values (mssv, content, `hoc-phi`, `Đang chờ`)';
    //     db.query(sql, (err, data) => {
    //         if (err) throw err;
    //     })
    // }
    res.render('reduceTuition', {
        title: 'Miễn giảm học phí'
    });
}

exports.onReduceTuition = (req, res) => {

    var fullName = req.body.fullName;
    var mssv = req.body.mssv;
    var email = req.body.email;
    var phone = req.body.phoneNumber;
    var content = req.body.content;
    if (fullName != null && mssv != null && email != null && phone != null && content != null) {
        var sql = 'INSERT INTO request(studentID, content, Type, status) values (?, ?, ?, ?)';
        db.query(sql, [1900420, content, 'hoc-phi', 'Đang chờ'], (err, data) => {
            if (err) throw err;
        })
    }
    res.render('index');
}

exports.viewFeedBackPage = (req, res) => {
    // var mssv = '1900420'; //hoặc lấy từ session
    // var sql = 'select'
    res.render('feedBackPage', {
        title: 'Phản ánh chất lượng'
    });
}
exports.viewUpdateInfo = (req, res) => {
    res.render('updateInfo', {
        title: 'Chỉnh sửa thông tin'
    });
}

exports.updateInfo = (req, res) => {
    //console.log(req);
    var fullName = req.body.fullName;
    var mssv = req.body.mssv;
    var phone = req.body.phone;
    var sonha = req.body.houseNumber;
    var street = req.body.street;
    var province = req.body.province;
    if (fullName != null && mssv != null && phone != null && sonha != null && street != null && province != null) {
        var sql = 'insert into student_phone values(?,?);';
        db.query(sql, [mssv, phone], (err, data) => {
            if (err) throw err;
        })
        var sql = 'update student set ApartmentNumber = ?, Street = ?, province = ? where id = ?;';
        db.query(sql, [sonha, street, province, mssv], (err, data) => {
            if (err) throw err;
        })
        res.render('index', {
            title: 'Thông báo'
        });
    } else res.send('Lỗi');
}

exports.addDependent = (req, res) => {
    var mssv = req.body.mssv;
    var name = req.body.dfullname;
    var phone = req.body.dphone;
    var relation = req.body.drelation;
    var houseNumber = req.body.dhouseNumber;
    var street = req.body.dstreet;
    var province = req.body.dprovince;
    if (mssv != null && name != null && phone != null && relation != null && houseNumber != null && street != null && province != null) {
        var sql = 'insert into parents values (?,?,?,?);';
        db.query(sql, [mssv, name, houseNumber + ', ' + street + ', ' + province, relation], (err, data) => {
            if (err) throw err;
        })
        sql = 'insert into parent_phone values (?,?,?);';
        db.query(sql, [mssv, name, phone], (err, data) => {
            if (err) throw err;
        })
        res.render('index', {
            title: 'Thông báo'
        });
    } else res.send('Lỗi');
}

exports.sendFeedback = (req, res) => {
    var mssv = req.body.mssv; //hoặc lấy từ session
    var subjectID = req.body.subject;
    var content = req.body.content;
    if (mssv != null && subjectID != null && content != null) {
        var sql = 'insert into feedback(studentID, subjectID, content) values (?,?,?);';
        db.query(sql, [mssv, subjectID, content], (err, data) => {
            if (err) throw err;
        })
        res.render('index', {
            title: 'Thông báo'
        });
    } else res.send('Lỗi');
}