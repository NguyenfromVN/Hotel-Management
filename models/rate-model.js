const db = require("../utils/db");
const tbName = "rate";
const tbBanName = "banlist";

module.exports = class Rate {
  constructor() {}

  static async getRate() {
    const sql = `SELECT * FROM ${tbName}`;
  }
  static async add(rate) {
    const id = await db.add(tbName, rate);
    return id;
  }
  static async addBanList(banRow) {
    const id = await db.add(tbBanName, banRow);
    return id;
  }
};
