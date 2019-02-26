let mysql = require('mysql');
let Promise = require('bluebird');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'juejin',
    user: 'root',
    password: '123456',
    insecureAuth : true
});
connection.connect();
let query = Promise.promisify(connection.query).bind(connection);

// connection.query('SELECT * from student', function(err, rows, fields){
//     console.log(err);
//     console.log(rows);
//     console.log(fields);
//     connection.end();
// });
module.exports = {
    query
};