const funcs = require("../utils/ctr-function");
const mAccount = require("../models/account-model");
const mWatchList = require("../models/watch-list-model");
const mAuction = require("../models/auction-model");
const mProd = require("../models/products-model");
const UIFuncs = require("../utils/UI-function");
const hash = require("../utils/hash");

exports.getProfile = async (req, res, next) => {
  // Get User From Section:
  const user = funcs.authUser(req);
  if (user.isBidder) {
    // get Info of user from Account db:
    const acc = await mAccount.getUserByEmail(user.email);
    if (acc.DownVote + acc.UpVote != 0)
      acc.judgedCore = (
        (acc.UpVote / (acc.DownVote + acc.UpVote)) *
        100
      ).toFixed(2);
    else acc.judgedCore = 0;
    res.render("bidder/profile", {
      acc: acc,
      profile: true,
      user: user,
      layout: "account-layout.hbs"
    });
  }
};

function SetIndex(list) {
  if (list != null) {
    let i = 1;
    list.forEach(e => {
      e.index = i++;
      e.status = e.IsDeleted === 0 ? "Not Yet" : "Sold/Is Deleted";
      e.CurrentPrice = UIFuncs.FormatMoney(e.CurrentPrice);
      if (e.Price != undefined) e.Price = UIFuncs.FormatMoney(e.Price);
    });
  }
}

exports.editProfile = async (req, res, next) => {
  const acc = await mAccount.getUserByEmail(req.body.email);
  if (hash.cmpPassword(req.body.old_password, acc.Pass, acc.Email)) {
    const user = {
      Email: req.body.email,
      UName: req.body.uname,
      Address: req.body.address,
      Phone: req.body.phone
    };
    if (req.body.birthday != "") user.DoB = req.body.birthday;
    user.Pass = hash.getHashWithSalt(req.body.new_password, req.body.email);
    const nr = await mAccount.update(user);
  }
  res.redirect("/profile");
};

exports.getWatchList = async (req, res, next) => {
  // Get User From Section:
  const user = funcs.authUser(req);
  // Get Watch List from database:
  const watchList = await mWatchList.getWatchList(user.email);
  const joinList = await mAuction.getJoinList(user.email);
  const successList = await mProd.getProductsSuccess(user.email);
  // Set index + Satus:
  SetIndex(watchList);
  SetIndex(joinList);
  SetIndex(successList);
  // Seller:
  let postingList = null,
    soldList = null;
  if (user.isSeller) {
    postingList = await mProd.getProductsPosting(user.email);
    SetIndex(postingList);
    soldList = await mProd.getProductsSold(user.email);
    SetIndex(soldList);
  }
  res.render("bidder/watch-list", {
    watchList: watchList,
    joinList: joinList,
    successList: successList,
    postingList: postingList,
    soldList: soldList,
    user: user,
    layout: "account-layout.hbs"
  });
};

exports.addWatchList = async (req, res, next) => {
  // Get User From Section:
  const user = funcs.authUser(req);
  const prodId = req.body.prodId;
  const prod = {
    ProID: prodId,
    Email: user.email
  };
  // Check this product had seen before by this user:
  const check = await funcs.checkWatchList(prod);
  // Add Watch List:
  if (check) await mWatchList.add(prod);
  res.redirect(`/${prodId}/product-detail`);
};

exports.auctionOnline = async (req, res, next) => {
  // Get User From Section:
  const user = funcs.authUser(req);
  // Get money of bidder auction online and Product ID of this Product:
  const moneyAuction = req.body.moneyAuction;
  const prodId = req.body.prodId;
  // Set Auction:
  const auction = {
    ProID: prodId,
    BidTime: new Date(),
    Bidder: user.email,
    Price: moneyAuction
  };
  const check = await funcs.checkAuctionCondition(moneyAuction, prodId, user);
  if (check) await mAuction.add(auction);

  res.redirect(`/${prodId}/product-detail`);
};

exports.upSellerRequest = async (req, res, next) => {
  const up = {
    Email: req.body.email,
    RequestTime: new Date()
  };
  const check = await mAccount.getUpselByEmail(up.Email);
  const idUp =
    check == null
      ? await mAccount.addUpSel(up)
      : await mAccount.updateUpSel(up);

  res.redirect("/profile");
};
