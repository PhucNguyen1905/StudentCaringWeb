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

//xem danh sách feed back
exports.viewFeedback = (req, res) => {
    STAFF = res.locals.user;
    //lấy data feedback
    sql = 'select * from feedback';
    connection.query(sql, (err, data) => {
        if (err) throw err;
        res.render('staff/feedback', {
            title: 'Phản ánh chất lượng',
            feedbacks: data
        });
    })
}

//xem chi tiết feedback
exports.viewFeedbackDetail = (req, res) => {
    var feedbackID = req.params.id;
    var sql = 'select * from feedback where id = ?';
    connection.query(sql, [feedbackID], (err, data) => {
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
                        res.render('staff/feedbackDetail', {
                            title: 'Chi tiết phản hồi',
                            feedbackDetail: data[0],
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

//xóa feed back
exports.deleteFeedback = (req, res) => {
    //thông báo đến sinh viên
    var sql = 'insert into reply(studentID, title, content, seen) values (?,?,?,?)';
    connection.query(sql, [req.body.studentID, 'Xóa nội dung phản hồi chất lượng', req.body.content, false], (err, data) => {
        if (err) throw err;
        //xóa
        var feedbackID = req.params.id;
        var sql1 = 'delete from feedback where id = ?';
        connection.query(sql1, [feedbackID], (err, data) => {
            if (err) throw err;
            //Cập nhât lại feed back
            sql = 'select * from feedback';
            connection.query(sql, (err, data1) => {
                if (err) throw err;
                res.render('staff/feedback', {
                    title: 'Phản ánh chất lượng',
                    feedbacks: data1
                });
            })
        })
    })
}

exports.respondFeedback = (req, res) => {
    //thông báo đến sinh viên
    var sql = 'insert into reply(studentID, title, content, seen) values (?,?,?,?)';
    connection.query(sql, [req.body.studentID, 'Trả lời cho phản hồi chất lượng', req.body.content, false], (err, data) => {
        if (err) throw err;
        //lấy data feedback
        sql = 'select * from feedback';
        connection.query(sql, (err, data) => {
            if (err) throw err;
            res.render('staff/feedback', {
                title: 'Phản ánh chất lượng',
                feedbacks: data,
                user: STAFF
            });
        })
    })

}