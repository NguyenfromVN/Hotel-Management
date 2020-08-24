const mAccount = require("../models/account-model");
const mProd = require("../models/products-model");
const mCat = require("../models/categories-model");
const funcs = require("../utils/ctr-function");
const mRate = require("../models/rate-model");

function setTable(req, tb) {
  req.session.table = {
    cats: false,
    products: false,
    users: false,
    productTypes: false,
    ups: false
  };
  req.session.table[tb] = true;
}

function setIndex(list) {
  if (list != null) {
    let index = 1;
    list.forEach(e => {
      e.index = index++;
    });
  }
}

exports.admimManage = async (req, res, next) => {
  let table = req.session.table;
  if (table === undefined) table = { cats: true };
  // Authenticate Users:
  const user = funcs.authUser(req);
  // Get Data via model:
  const cats = await mCat.getCategory();
  const prodTypes = await mCat.getProductType();
  const products = await mProd.getProducts();
  const accs = await mAccount.getUser();
  const ups = await mAccount.getUpsel();
  setIndex(accs);
  setIndex(ups);
  if (ups != null) {
    ups.forEach(e => {
      if (e.DownVote != 0 || e.UpVote != 0)
        e.judgedCore = ((e.UpVote / (e.UpVote + e.DownVote)) * 100).toFixed(2);
      else e.judgedCore = 0;
    });
  }

  res.render("admin/admin-manage", {
    layout: "admin-layout.hbs",
    user: user,
    table: table,
    cats: cats,
    prodTypes: prodTypes,
    products: products,
    accs: accs,
    ups: ups
  });
};

// Catgories Activity:--------------------------------------------------------------------------

exports.editCatName = async (req, res, next) => {
  setTable(req, "cats");
  const entity = {
    CatID: req.body.id,
    CatName: req.body.name
  };
  console.log(entity);
  const nr = await mCat.updateCat(entity);
  res.redirect("/admin");
};

exports.delCat = async (req, res, next) => {
  setTable(req, "cats");
  const catId = req.body.catId;
  const nr = await mCat.delCat(catId);
  res.redirect("/admin");
};

exports.addCat = async (req, res, next) => {
  setTable(req, "cats");
  const entity = {
    CatID: req.body.catId,
    CatName: req.body.catName,
    TypeID: req.body.typeId
  };
  if (entity.CatID === "" || entity.CatName === "")
    return res.redirect("/admin");
  const nr = await mCat.addCat(entity);
  res.redirect("/admin");
};

// Products Activity:--------------------------------------------------------------------------
exports.editProdName = async (req, res, next) => {
  setTable(req, "products");
  const entity = {
    ProID: req.body.id,
    PName: req.body.name
  };
  const nr = await mProd.update(entity);
  res.redirect("/admin");
};

exports.delProd = async (req, res, next) => {
  setTable(req, "products");
  const prodId = req.body.productId;
  const nr = await mProd.del(prodId);
  res.redirect("/admin");
};

// Users Activity:--------------------------------------------------------------------------
exports.delUser = async (req, res, next) => {
  setTable(req, "users");
  const userId = req.body.userId;
  const nr = await mAccount.del(userId);
  res.redirect("/admin");
};

// UpSeller Activiti:-----------------------------------------------------------------------
exports.upSel = async (req, res, next) => {
  setTable(req, "ups");
  const agree = req.body.agree;
  const email = req.body.email;
  // Up seller:
  if (agree === "1") {
    const nrAcc = await mAccount.update({ Email: email, Degree: "Seller" });
  }
  // Delete upsel request:
  const nrUp = await mAccount.delUpSel(email);
  res.redirect("/admin");
};
