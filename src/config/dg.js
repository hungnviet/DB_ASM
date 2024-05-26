const mysql2 = require("mysql2");
let db;

function createDbConnection(user, password) {
  console.log("Creating database connection...");
  console.log(user);
  console.log(password);
  if (!db || user === "admin" || user === "usertemp") {
    db = mysql2.createConnection({
      host: "127.0.0.1",
      port: "3306",
      user: user,
      password: password,
      database: "e_commerce",
      timezone: "Z", // Set timezone to UTC
      connectTimeout: 10000,
    });

    db.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(
          `Connected to database successfully as user ${user} from functional!`
        );
      }
    });
    return db;
  } else {
    return db;
  }
}

module.exports = createDbConnection;
