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

//xem các yêu cầu của sinh viên
exports.viewPrint = (req, res) => {
    STAFF = res.locals.user;
    var sql = 'select * from document_request';
    connection.query(sql, (err, data) => {
        if (err) throw err;
        res.render('staff/print', {
            title: 'Danh sách yêu cầu',
            data: data,
            user: STAFF
        })
    })
}

exports.refuseRequest = (req, res) => {
    var requestID = req.params.id;
    //thông báo đến sinh viên qua bảng reply
    var content = req.body.content;
    var sql1 = 'insert into reply(studentID, title, content, seen) values(?,?,?,?)';
    connection.query(sql1, [req.body.studentID, 'Yêu cầu in tài liệu bị từ chối', req.body.content, 'false'], (err, data1) => {
        if (err) throw err;
    })

    var sql = 'update document_request set status = ? where ID = ?';
    connection.query(sql, ['Từ chối', requestID], (err, data) => {
        if (err) throw err;
        //cập nhật lại các yêu cầu
        var sql1 = 'select * from document_request';
        connection.query(sql1, (err, data) => {
            if (err) throw err;
            res.render('staff/print', {
                title: 'Danh sách yêu cầu',
                data: data,
                user: STAFF
            })
        })
    })
}

exports.completeRequest = (req, res) => {
    var requestID = req.params.id;
    //gửi thông báo đến sinh viên thông qua bảng reply
    var content = req.body.content;
    var sql1 = 'insert into reply(studentID, title, content, seen) values(?,?,?,?)';
    connection.query(sql1, [req.body.studentID, 'Về yêu cầu in tài liệu được chấp nhận', req.body.content, 'false'], (err, data1) => {
        if (err) throw err;
    })

    var sql = 'update document_request set status = ? where ID = ?';
    connection.query(sql, ['Đã xong', requestID], (err, data) => {
        if (err) throw err;
        //cập nhật lại các yêu cầu
        var sql1 = 'select * from document_request';
        connection.query(sql1, (err, data) => {
            if (err) throw err;
            res.render('staff/print', {
                title: 'Danh sách yêu cầu',
                data: data,
                user: STAFF
            })
        })
    })
}

exports.deleteRequest = (req, res) => {
    var requestID = req.params.id;
    //thông báo đến sinh viên thông qua reply
    var content = req.body.content;
    var sql1 = 'insert into reply(studentID, title, content, seen) values(?,?,?,?)';
    connection.query(sql1, [req.body.studentID, 'Về yêu cầu in tài liệu đã xóa', req.body.content, 'false'], (err, data1) => {
        if (err) throw err;
    })

    var sql = 'delete from document_request where ID = ?';
    connection.query(sql, [requestID], (err, data) => {
        if (err) throw err;
        //cập nhật lại các yêu cầu
        var sql1 = 'select * from document_request';
        connection.query(sql1, (err, data) => {
            if (err) throw err;
            res.render('staff/print', {
                title: 'Danh sách yêu cầu',
                data: data,
                user: STAFF
            })
        })
    })
}

exports.viewPrintDetail = (req, res) => {
    //get request id
    var requestID = req.params.id;
    var sql = 'select * from document_request where ID = ?';
    connection.query(sql, [requestID], (err, data) => {
        if (err) throw err;
        //lấy thông tin sinh viên
        var sql1 = 'select * from student where id = ?';
        connection.query(sql1, [data[0].studentID], (err, data1) => {
            if (err) throw err;
            //lấy thông tin khoa
            var sql2 = 'SELECT * FROM faculty WHERE ID = ?';
            connection.query(sql2, [data1[0].Faculty_ID], (err, data2) => {
                if (err) throw err;
                //lấy số điện thoại sv
                var sql3 = 'select PHONE from student_phone where StudentID = ?';
                connection.query(sql3, [data1[0].id], (err, data3) => {
                    //lấy thông tin người thân
                    var sql4 = 'select * from parents where StudentID = ?';
                    connection.query(sql4, [data1[0].id], (err, data4) => {
                        if (err) throw err;
                        //load trang với dữ liệu đã có
                        res.render('staff/printDetail', {
                            title: 'Thông tin tài liệu',
                            studentInfo: data1[0],
                            fal: data2[0],
                            phones: data3,
                            relations: data4,
                            docInfo: data[0]
                        })
                    })
                })

            })
        })
    })
}