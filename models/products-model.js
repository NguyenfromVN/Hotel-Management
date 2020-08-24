const db = require("../utils/db");
const tbName = "product",
  tbCatName = "category",
  pageSize = 3,
  idField = "ProID",
  tbUser = "user";

module.exports = class Prod {
  constructor() {}

  static async getProducts() {
    const sql = `SELECT * FROM ${tbName}`;
    const rows = await db.load(sql);
    return rows;
  }

  static async getTop5Rating() {
    const sql = `SELECT *
    FROM ${tbName}
    WHERE EndTime > NOW()
    ORDER BY BidCount DESC
    LIMIT 5`;
    const rows = await db.load(sql);
    return rows.length > 0 ? rows : null;
  }

  static async getTop5EndSoon() {
    const sql = `SELECT *
    FROM ${tbName}
    WHERE EndTime > NOW()
    ORDER BY EndTime ASC
    LIMIT 5`;
    const rows = await db.load(sql);
    return rows.length > 0 ? rows : null;
  }

  static async getTop5HighestPrices() {
    const sql = `SELECT *
    FROM ${tbName}
    WHERE EndTime > NOW()
    ORDER BY CurrentPrice DESC
    LIMIT 5`;
    const rows = await db.load(sql);
    return rows.length > 0 ? rows : null;
  }

  static async getProductsById(prodId) {
    const sql = `SELECT *
    FROM ${tbName} p
    WHERE p.ProID = "${prodId}"`;
    const rows = await db.load(sql);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getFullProductByID(prodId) {
    const sql = `SELECT p.*, u.Phone, u.UpVote, u.DownVote
    FROM ${tbName} p INNER JOIN user u ON p.Seller =  u.Email
    WHERE p.ProID = "${prodId}"`;
    const rows = await db.load(sql);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getProductsByCatId(catId) {
    const sql = `SELECT * FROM ${tbName} WHERE ${tbName}.CatID = "${catId}" AND EndTime > NOW()`;
    const rows = await db.load(sql);
    return rows;
  }

  static async getAllByCatIdPaging(catId, page) {
    let sql = `SELECT count(*) as total FROM ${tbName} WHERE CatID = "${catId}" AND EndTime > NOW()`;
    const rs = await db.load(sql);
    const totalProd = rs[0].total;
    const pageTotal =
      totalProd % pageSize === 0
        ? totalProd / pageSize
        : Math.floor(totalProd / pageSize) + 1;
    const offset = (page - 1) * pageSize;
    sql = `SELECT * FROM ${tbName} WHERE CatID = "${catId}" AND EndTime > NOW() LIMIT ${pageSize} OFFSET ${offset}`;
    const rows = await db.load(sql);
    return {
      pageTotal: pageTotal,
      products: rows
    };
  }

  static async getProductsByName(name) {
    const sql = `SELECT * FROM ${tbName} WHERE ${tbName}.PName LIKE N'%${name}%' AND EndTime > NOW()`;
    const rows = await db.load(sql);
    return rows;
  }

  static async getAllByNamePaging(name, page) {
    let sql = `SELECT count(*) as total FROM ${tbName} WHERE ${tbName}.PName LIKE N'%${name}%' AND EndTime > NOW()`;
    const rs = await db.load(sql);
    const totalProd = rs[0].total;
    const pageTotal =
      totalProd % pageSize === 0
        ? totalProd / pageSize
        : Math.floor(totalProd / pageSize) + 1;
    const offset = (page - 1) * pageSize;
    sql = `SELECT * FROM ${tbName} WHERE ${tbName}.PName LIKE N'%${name}%' AND EndTime > NOW() LIMIT ${pageSize} OFFSET ${offset}`;
    const rows = await db.load(sql);
    return {
      pageTotal: pageTotal,
      products: rows
    };
  }

  static async getProductsSuccess(email) {
    const sql = `SELECT ProID, PName, Seller, CurrentPrice FROM ${tbName} WHERE TopBidder = "${email}" AND IsDeleted = 0 and EndTime < NOW()`;
    const rows = await db.load(sql);
    return rows;
  }

  static async getProductsPosting(email) {
    const sql = `SELECT ProID, PName, CurrentPrice FROM ${tbName} WHERE Seller = "${email}" AND IsDeleted = 0 and EndTime > NOW()`;
    const rows = await db.load(sql);
    return rows;
  }

  static async getProductsSold(email) {
    const sql = `SELECT ProID, PName, CurrentPrice, TopBidder FROM ${tbName} WHERE Seller = "${email}" AND IsDeleted = 0 and EndTime < NOW()`;
    const rows = await db.load(sql);
    return rows;
  }

  static async getHighestProID() {
    const sql = `SELECT ProID FROM ${tbName} ORDER BY ProID DESC LIMIT 1`;
    const rows = await db.load(sql);
    return rows;
  }
  static async update(entity) {
    const nr = await db.update(tbName, idField, entity);
    return nr;
  }
  static async add(product) {
    const id = await db.add(tbName, product);
    return id;
  }
  static async del(prodId) {
    const nr = await db.del(tbName, idField, prodId);
    return nr;
  }
};
