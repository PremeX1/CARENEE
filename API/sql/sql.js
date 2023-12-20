var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carenee"
});

con.connect();

const getStudentInfo = (id, callback) => {
  const query = `SELECT * FROM student WHERE stu_id = "${id}"`;
  con.query(query, (err, result) => {
    callback(result);
  });
}

const getRequestByID = (id, callback) => {
  const query = `SELECT * FROM request WHERE request_by = "${id}"`;
  con.query(query, (err, result) => {
    callback(result);
  });
}

const getNotificate = (id, callback) => {
  const query = `SELECT * FROM notify WHERE by_stuID = "${id}" ORDER BY ID DESC`;
  con.query(query, (err, result) => {
    callback(result);
  });
}

const getGradeStudent = (id, callback) => {
  const query = `SELECT * FROM student_grade WHERE by_stuID = "${id}" ORDER BY ID DESC`;
  con.query(query, (err, result) => {
    callback(result);
  });
}


const addRequest = (data, callback) => {
  const query = `INSERT INTO request (request_type, request_by, request_msg, request_status, request_time)
  VALUES('${data.request_type}', '${data.request_by}', '${data.request_msg}', '${data.request_status}', '${data.request_time}')`;
  con.query(query, (err, result) => {
    callback(result);
    if(err) throw err;
  });
}

const addStudentID = (callback) => {
  const query = `INSERT INTO student (id, profile_pic, fulll_name, room, stu_id, phone, password, check_in) VALUES (NULL, "https://cdn.discordapp.com/attachments/982236915153641472/982236994610532352/received_1003737893663633.jpeg", 'นายธนกฤต จอมหงษ์ ', '5/3','26295', '0973039516', '$2b$10$TftGOhKNrlowI4KE5GP8/OnbVOdpYYH4J6cMbTGU1L8ajM69Csc8y', '2/2/2566 11:19');`;
  con.query(query, (err, result) => {
    callback(result);
  });
}


console.log("Successfully Connect")

module.exports = {
  getRequestByID, getRequestByID,
  addRequest: addRequest,
  getStudentInfo: getStudentInfo,
  addStudentID: addStudentID,
  getNotificate: getNotificate,
  getGradeStudent: getGradeStudent,
}