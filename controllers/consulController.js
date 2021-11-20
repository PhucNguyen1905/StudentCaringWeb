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

let CONSULTANT;

function convertDate(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

exports.viewHome = (req, res) => {
    CONSULTANT = res.locals.user;
    res.render('consultant/consul_index', {
        title: 'Home'
    })
}

exports.viewChat = (req, res) => {
    let consID = CONSULTANT.ID;
    let conSql = 'SELECT * FROM student s WHERE s.id IN (SELECT student_id FROM contents WHERE Consultant_ID = ? ORDER BY id DESC)'
    connection.query(conSql, [consID], (error, students) => {
        // When done with the connection, release it
        if (error) throw error;
        let latestStuID = students[0].id;
        let messSql = 'SELECT * FROM contents WHERE student_id = ? AND Consultant_ID = ?'
        connection.query(messSql, [latestStuID, consID], (err, messsages) => {
            if (err) throw err;
            res.render('consultant/chat_consul', {
                title: 'Tin nhắn',
                user: CONSULTANT,
                students: students,
                messages: messsages,
                convertDate: convertDate
            })
        })

    });


}
exports.viewChatByID = (req, res) => {
    let stuID = parseInt(req.params.id);
    let consID = CONSULTANT.ID;
    let conSql = 'SELECT * FROM student s WHERE s.id IN (SELECT student_id FROM contents WHERE Consultant_ID = ? ORDER BY id DESC)'
    connection.query(conSql, [consID], (error, students) => {
        // When done with the connection, release it
        if (error) throw error;
        let latestStuID = stuID;
        let messSql = 'SELECT * FROM contents WHERE student_id = ? AND Consultant_ID = ?; SELECT * FROM student WHERE id = ?;'
        connection.query(messSql, [latestStuID, consID, stuID], (err, results) => {
            if (err) throw err;
            messages = results[0];
            detailStudents = results[1];
            res.render('consultant/chat_consul_id', {
                title: 'Tin nhắn',
                user: CONSULTANT,
                students: students,
                messages: messages,
                detailStudent: detailStudents[0],
                convertDate: convertDate
            })
        })

    });


}

// POST send message
exports.sendMessage = (req, res) => {
    let stuID = parseInt(req.params.id);
    let content = req.body.content;
    let consID = CONSULTANT.ID;
    let sql = 'INSERT INTO contents(Consultant_ID, student_id, content, qoa) VALUES (?,?,?,?)';
    connection.query(sql, [consID, stuID, content, 1], (e, resul) => {
        // When done with the connection, release it
        if (e) throw e;
        let conSql = 'SELECT * FROM student s WHERE s.id IN (SELECT student_id FROM contents WHERE Consultant_ID = ? ORDER BY id DESC)'
        connection.query(conSql, [consID], (error, students) => {
            // When done with the connection, release it
            if (error) throw error;
            let latestStuID = stuID;
            let messSql = 'SELECT * FROM contents WHERE student_id = ? AND Consultant_ID = ?; SELECT * FROM student WHERE id = ?;'
            connection.query(messSql, [latestStuID, consID, stuID], (err, results) => {
                if (err) throw err;
                messages = results[0];
                detailStudents = results[1];
                res.render('consultant/chat_consul_id', {
                    title: 'Tin nhắn',
                    user: CONSULTANT,
                    students: students,
                    messages: messages,
                    detailStudent: detailStudents[0],
                    convertDate: convertDate
                })
            })

        });
    });

}








