const mysql = require("mysql");

function createConnection() {
  return mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "auction_online"
  });
}
exports.load = sql => {
  return new Promise((resole, reject) => {
    const con = createConnection();
    con.connect(err => {
      if (err) {
        console.log("error");
      }
    });
    con.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else resole(results);
    });
    con.end();
  });
};

exports.add = (tbName, entity) => {
  return new Promise((resole, reject) => {
    const con = createConnection();
    con.connect(err => {
      if (err) {
        reject(err);
      }
    });
    const sql = `INSERT INTO ${tbName} SET ?`;
    con.query(sql, entity, (error, results, fields) => {
      if (error) reject(error);
      else resole(results);
    });
    con.end();
  });
};

exports.del = (tbName, idField, id) => {
  return new Promise((resole, reject) => {
    const con = createConnection();
    con.connect(err => {
      if (err) reject(err);
    });
    let sql = `DELETE FROM ?? WHERE ?? = ?`;
    const params = [tbName, idField, id];
    sql = mysql.format(sql, params);
    con.query(sql, (error, results, fields) => {
      if (error) reject(error);
      else resole(results);
    });
    con.end();
  });
};

exports.update = (tbName, idField, entity) => {
  return new Promise((resole, reject) => {
    const con = createConnection();
    con.connect(err => {
      if (err) reject(err);
    });
    const id = entity[idField];
    delete entity[idField];
    let sql = `UPDATE ${tbName} SET ? WHERE ${idField} = "${id}"`;
    sql = mysql.format(sql, entity);
    con.query(sql, (error, results, fields) => {
      if (error) reject(error);
      else resole(results);
    });
    con.end();
  });
};
