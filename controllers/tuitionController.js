const mysql = require("mysql");
const { isStaff } = require("../config/auth");

//Connection pool
const connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

let STAFF;

//xem danh sách các yêu cầu miễn giảm học phí
exports.viewRequest = (req, res) => {
    STAFF = res.locals.user;
    //lấy dữ liệu từ database
    var sql = 'select * from request where type = ?';
    connection.query(sql, ['Giảm học phí'], (err, data) => {
        if (err) throw err;
        res.render('staff/tuition', {
            requestData: data,
            user: STAFF,
            title: 'Danh sách miễn giảm học phí'
        })
    })
}

//Xem chi tiết cụ thể của yêu cầu
exports.viewRequestDetail = (req, res) => {
    var requestID = req.params.id;
    var sql = 'select * from request where id = ?';
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
                        res.render('staff/requestDetail', {
                            title: 'Chi tiết yêu cầu',
                            user: STAFF,
                            requestInfo: data[0],
                            studentInfo: data1[0],
                            fal: data2[0],
                            phones: data3,
                            relations: data4
                        })
                    })
                })

            })

        })
    })
}

//Đồng ý yêu cầu
exports.acceptRequest = (req, res) => {
    var requestID = req.params.id; // get request id
    //thông báo sinh viên qua reply
    var sql1 = 'insert into reply(studentID, title, content, seen) values (?,?,?,?)';
    connection.query(sql1, [req.body.studentID, 'Chấp nhận yêu cầu giảm học phí', req.body.content, false], (err, data1) => {
        if (err) throw err;
    })


    var sql = 'update request set rstatus = ? where id = ?';
    connection.query(sql, ['Đồng ý', requestID], (err, data) => {
        if (err) throw err;
        //cập nhật lại danh sách yêu cầu
        var sql = 'select * from request where type = ?';
        connection.query(sql, ['Giảm học phí'], (err, data) => {
            if (err) throw err;
            res.render('staff/tuition', {
                requestData: data,
                user: STAFF,
                title: 'Danh sách miễn giảm học phí'
            })
        })
    })
}

//từ chối yêu cầu
exports.rejectRequest = (req, res) => {
    var requestID = req.params.id; //get request id
    //thông báo đến sv thông qua bảng reply
    var sql1 = 'insert into reply(studentID, title, content, seen) values (?,?,?,?)';
    connection.query(sql1, [req.body.studentID, 'Từ chối yêu cầu giảm học phí', req.body.content, false], (err, data1) => {
        if (err) throw err;
    })

    var sql = 'update request set rstatus = ? where id = ?';
    connection.query(sql, ['Từ chối', requestID], (err, data) => {
        if (err) throw err;
        //cập nhật lại danh sách yêu cầu
        var sql = 'select * from request where type = ?';
        connection.query(sql, ['Giảm học phí'], (err, data) => {
            if (err) throw err;
            res.render('staff/tuition', {
                requestData: data,
                user: STAFF,
                title: 'Danh sách miễn giảm học phí'
            })
        })
    })
}

//Xóa yêu cầu
exports.deleteRequest = (req, res) => {
    var requestID = req.params.id; // get request id
    // thông báo đến sv
    var sql1 = 'insert into reply(studentID, title, content, seen) values (?,?,?,?)';
    connection.query(sql1, [req.body.studentID, 'Yêu cầu giảm học phí đã bị xóa', req.body.content, false], (err, data1) => {
        if (err) throw err;
    })

    var sql = 'delete from request where id = ?';
    connection.query(sql, [requestID], (err, data) => {
        if (err) throw err;
        //cập nhật lại danh sách yêu cầu
        var sql = 'select * from request where type = ?';
        connection.query(sql, ['Giảm học phí'], (err, data) => {
            if (err) throw err;
            res.render('staff/tuition', {
                requestData: data,
                user: STAFF,
                title: 'Danh sách miễn giảm học phí'
            })
        })
    })
}