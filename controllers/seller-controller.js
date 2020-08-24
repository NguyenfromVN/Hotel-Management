const funcs = require("../utils/ctr-function");
const mCat = require("../models/categories-model");
const mProd = require("../models/products-model");
const mAuct = require("../models/auction-model");
const mAccount = require("../models/account-model");
const mRate = require("../models/rate-model");
const multer = require("multer");
var fs = require("fs");
const path = require("path");

exports.getSubmitProduct = async (req, res, next) => {
  const cats = await mCat.getCategory();

  // Get User From Section:
  const user = funcs.authUser(req);
  res.render("seller/post-product", {
    type: cats,
    postProduct: true,
    user: user,
    layout: "account-layout.hbs"
  });
};

function ProIDAutoSet(str) {
  var num = parseInt(str.substring(1, 6), 10);
  num = num + 1;
  str = num.toString();
  var pad = "P00000";
  var ans = pad.substring(0, pad.length - str.length) + str;
  return ans;
}

// var newProID = ""; Fault!!!

exports.postSubmitProduct = async (req, res, next) => {
  const maxProID = await mProd.getHighestProID();
  req.session.newProID = ProIDAutoSet(maxProID[0].ProID);
  // Get User From Section:
  const user = funcs.authUser(req);
  const seller = user.email;
  const start = new Date();
  let countdown = req.body.countdown;
  if (countdown > 99) countdown = 99;
  let timeAdd = req.body.timeAdd === undefined ? 0 : req.body.timeAdd;
  if (timeAdd > 30) timeAdd = 30;
  const end = new Date(start.getTime() + countdown * (1000 * 3600 * 24));
  const pprice = parseInt(req.body.pprice, 10);
  const ppurchase = parseInt(req.body.ppurchase, 10);
  const product = {
    ProID: req.session.newProID,
    CatID: req.body.catid,
    PName: req.body.pname,
    Seller: seller,
    PDescription: req.body.pdes,
    StartTime: start,
    EndTime: end,
    BidCount: 0,
    StartPrice: pprice,
    PriceStep: req.body.priceStep,
    CurrentPrice: req.body.pprice,
    PurchasePrice: ppurchase,
    AutoExpandTime: timeAdd,
    IsDeleted: 0
  };
  const add = await mProd.add(product);
  res.redirect("/post-product-image");
};

exports.getSubmitProductImage = async (req, res, next) => {
  // Get User From Section:
  const user = funcs.authUser(req);
  res.render("seller/post-image", {
    layout: "account-layout.hbs",
    user: user
  });
};

exports.postSubmitProductImage = async (req, res, next) => {
  var count = 1;
  var storage = multer.diskStorage({
    destination: `./public/images/${req.session.newProID}`,
    filename: function(req, file, cb) {
      cb(null, `${count++}.jpg`);
    }
  });
  var upload = multer({
    storage: storage
  }).array("file", 4);
  upload(req, res, err => {
    if (err) console.log(err);
  });
  res.redirect("/");
};

exports.sendJudge = async (req, res, next) => {
  // Authenticate User first:
  const user = funcs.authUser(req);
  const rate = {
    Judge: user.email,
    Who: req.body.bidder,
    RateTime: new Date(),
    Rating: req.body.rating,
    Feedback: null
  };
  // UpVote | DownVote:
  const userEntity = await mAccount.getUserByEmail(req.body.bidder);
  rate.Rating == 1 ? userEntity.UpVote++ : userEntity.DownVote++;
  // Update User and add Rate into database:
  const nr = await mAccount.update(userEntity);
  const id = await mRate.add(rate);
  res.redirect("/watch-list");
};

exports.banBidder = async (req, res, next) => {
  // Authenticate User first:
  const user = funcs.authUser(req);
  const prodId = req.body.prodId;
  const banRow = {
    ProID: prodId,
    Bidder: req.body.bidder
  };
  const id = await mRate.addBanList(banRow);

  // Get Product with ID:
  const product = await mProd.getProductsById(prodId);
  const highestPerson = await mAuct.getHighestPerson(prodId);
  // Update this Product:
  product.TopBidder = highestPerson.Bidder;
  product.CurrentPrice = highestPerson.Price;
  const nr = await mProd.update(product);
  // Redirect:
  res.redirect(`/${prodId}/product-detail`);
};

exports.editDes = async (req, res, next) => {
  // Authenticate User first:
  const user = funcs.authUser(req);
  // Get Product ID form request:
  const prodId = req.params.prodId;
  if (req.body.pdes != "") {
    let pdes = `<hr/><p>${new Date().toLocaleString()}</p>\n\n` + req.body.pdes;
    // Get Product By ID:
    const product = await mProd.getProductsById(prodId);
    product.PDescription += pdes;
    const id = await mProd.update(product);
  }

  res.redirect(`/${prodId}/product-detail`);
};
