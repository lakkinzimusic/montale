const mysql = require("mysql2");

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "montale",
    password: "b30upvu0rc6rn4mt"
});


module.exports = connection.promise();



