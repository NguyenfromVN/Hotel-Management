const db = require("../utils/db");
const tbCatName = "category";
const tbTypeName = "producttype";
const idFieldCat = "CatID";
const idFieldType = "TypeID";

module.exports = class Cat {
  constructor() {}

  static async getProductType() {
    const sql = `SELECT * FROM ${tbTypeName}`;
    const rows = await db.load(sql);
    return rows;
  }
  static async getCategory() {
    const sql = `SELECT * FROM ${tbCatName} C INNER JOIN ${tbTypeName} T ON C.TypeID = T.TypeID`;
    const rows = await db.load(sql);
    return rows;
  }
  static async addCat(entityCat) {
    const id = await db.add(tbCatName, entityCat);
    return id;
  }
  static async updateCat(entityCat) {
    const nr = await db.update(tbCatName, idFieldCat, entityCat);
    return nr;
  }
  static async delCat(catId) {
    const nr = await db.del(tbCatName, idFieldCat, catId);
    return nr;
  }
};
