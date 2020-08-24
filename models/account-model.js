const db = require("../utils/db");
const tbName = "user";
const tbUpseller = "upsellerrequest";
const idField = "Email";

module.exports = class User {
  constructor() {}

  static async add(user) {
    const id = await db.add(tbName, user);
    return id;
  }

  static async addUpSel(entity) {
    const id = await db.add(tbUpseller, entity);
    return id;
  }

  static async getUserByEmail(email) {
    const sql = `SELECT * FROM ${tbName} WHERE Email = "${email}"`;
    const user = await db.load(sql);
    return user.length > 0 ? user[0] : null;
  }

  static async getUser() {
    const sql = `SELECT * FROM ${tbName}`;
    const accs = await db.load(sql);
    return accs.length > 0 ? accs : null;
  }

  static async getUpsel() {
    const sql = `SELECT * FROM ${tbUpseller} UP INNER JOIN ${tbName} US ON UP.Email = US.Email`;
    const ups = await db.load(sql);
    return ups.length > 0 ? ups : null;
  }

  static async getUpselByEmail(email) {
    const sql = `SELECT Email FROM ${tbUpseller} WHERE Email = "${email}"`;
    const ups = await db.load(sql);
    return ups.length > 0 ? ups : null;
  }

  static async update(entity) {
    const nr = await db.update(tbName, idField, entity);
    return nr;
  }

  static async updateUpSel(entity) {
    const nr = await db.update(tbUpseller, "Email", entity);
    return nr;
  }

  static async del(email) {
    const nr = await db.del(tbName, idField, email);
    return nr;
  }

  static async delUpSel(email) {
    const nr = await db.del(tbUpseller, "Email", email);
    return nr;
  }
};
