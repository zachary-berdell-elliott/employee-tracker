const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "business_db"
})

module.exports = connection;