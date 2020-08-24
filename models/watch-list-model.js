const db = require("../utils/db");
const tbName = "watchlist";
const tbProductName = "product";

module.exports = class User {
  constructor() {}

  static async add(watchList) {
    const id = await db.add(tbName, watchList);
    return id;
  }

  static async getWatchList(email) {
    const sql = `SELECT * FROM ${tbName} INNER JOIN ${tbProductName} ON ${tbProductName}.ProID = ${tbName}.ProID  WHERE ${tbName}.Email = "${email}"`;
    const user = await db.load(sql);
    if (user.length > 0) {
      return user;
    }
    return null;
  }
};
