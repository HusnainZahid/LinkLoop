import mysql from "mysql"

export const db = mysql.createConnection({
  host: "db4free.net",
  user: "husnain",
  password: "1234567890",
  database: "sql_database",
})