const db = require("../utils/db");
const tbName = "bidhistory";
const tbProductName = "product";
const tbBanList = "banlist";

module.exports = class Auction {
  constructor() {}

  static async getAuctionHistory(prodId) {
    const sql = `SELECT * 
                FROM ${tbName} BH INNER JOIN ${tbProductName} P ON BH.ProID=P.ProID
                WHERE BH.ProID = "${prodId}" 
                      AND BH.Bidder NOT IN (
                                      SELECT B.Bidder
                                      FROM ${tbBanList} B
                                      WHERE B.ProID = "${prodId}")
                ORDER BY Price DESC LIMIT 5`;
    const rows = await db.load(sql);
    return rows.length > 0 ? rows : null;
  }

  static async getJoinList(email) {
    const sql = `select distinct P.ProID, PName, CurrentPrice, IsDeleted, MAX(Price) as Price, MAX(BidTime) as LastedAuction
                from ${tbName} BH inner join ${tbProductName} P on BH.ProID=P.ProID
                where P.IsDeleted = 0 and P.EndTime > NOW() and BH.Bidder = "${email}"
                group by P.ProID`;
    const rows = await db.load(sql);
    return rows.length > 0 ? rows : null;
  }

  static async getHighestPerson(prodId) {
    const sql = `SELECT * 
                FROM bidhistory b
                WHERE b.ProID = "${prodId}"
                      AND b.Bidder NOT IN (
                                      SELECT B.Bidder
                                      FROM banlist B
                                      WHERE B.ProID = "${prodId}")
                ORDER BY b.Price DESC
                LIMIT 1`;
    const row = await db.load(sql);
    return row.length > 0 ? row[0] : null;
  }

  static async getBanPerson(prodId, email) {
    const sql = `SELECT * 
                FROM banlist b 
                WHERE b.ProID = "${prodId}" AND b.Bidder = "${email}"`;
    const row = await db.load(sql);
    return row.length > 0 ? row[0] : null;
  }

  static async add(auction) {
    const id = await db.add(tbName, auction);
    return id;
  }
};
