// Modal module:
const mCat = require("../models/categories-model");
const mProd = require("../models/products-model");
const funcs = require("../utils/ctr-function");
const mAuction = require("../models/auction-model");
const UIFormat = require("../utils/UI-function");

exports.getHome = async (req, res, next) => {
  // Authenticate User first:
  const user = funcs.authUser(req);
  if (user.isAdmin) return res.redirect("/admin");
  // Get Table Essential:
  const prodTypes = await mCat.getProductType();
  const cats = await mCat.getCategory();
  // Cats:
  prodTypes.forEach(e => {
    e.cats = [];
    for (let cat of cats) {
      if (cat.TypeID === e.TypeID) {
        e.cats.push(cat);
      }
    }
  });
  // Top 5 end soon:
  const top5EndSoon = await mProd.getTop5EndSoon();
  const top5Rating = await mProd.getTop5Rating();
  const top5Price = await mProd.getTop5HighestPrices();
  funcs.FormatList(top5EndSoon);
  funcs.FormatList(top5Rating);
  funcs.FormatList(top5Price);
  // Render Views:
  res.render("general/home", {
    home: true,
    user: user,
    prodTypes: prodTypes,
    top5EndSoon: top5EndSoon,
    top5Rating: top5Rating,
    top5Price: top5Price
  });
};

exports.getProductByCat = async (req, res, next) => {
  // Authenticate User first:
  const user = funcs.authUser(req);
  // Cat ID:
  const catId = req.params.catId;
  const page = parseInt(req.query.page) || 1;
  // Get Table Essential:
  const prodTypes = await mCat.getProductType();
  const cats = await mCat.getCategory();
  //let products = await mProd.getProductsByCatId(catId);
  const rs = await mProd.getAllByCatIdPaging(catId, page);

  // Cook:
  // Pagination:
  const p = funcs.pageNav(page, rs.pageTotal);
  // Cats:
  cats.forEach(e => {
    e.isActive = e.CatID === catId ? true : false;
  });
  prodTypes.forEach(e => {
    e.cats = [];
    for (let cat of cats) {
      if (cat.TypeID === e.TypeID) {
        e.cats.push(cat);
      }
    }
  });
  // Sort By:
  if (req.query.sortBy != undefined)
    funcs.SortBy(rs.products, req.query.sortBy);
  // Format:
  funcs.FormatList(rs.products);

  res.render("general/list-products-cat", {
    option: req.query.sortBy,
    home: true,
    user: user,
    prodTypes: prodTypes,
    products: rs.products,
    navs: p.navs,
    pages: p.pages
  });
};

exports.getProductDetail = async (req, res, next) => {
  // Authenticate User first:
  const user = funcs.authUser(req);
  // Get product ID:
  const proId = req.params.proId;
  // Get Table Essential:
  const prodTypes = await mCat.getProductType();
  const cats = await mCat.getCategory();
  const product = await mProd.getFullProductByID(proId);
  // Format UI:
  product.HintPrice = UIFormat.FormatMoney(
    product.CurrentPrice + product.PriceStep
  );
  product.CurrentPrice = UIFormat.FormatMoney(product.CurrentPrice);
  product.PurchasePrice = UIFormat.FormatMoney(product.PurchasePrice);
  product.BidderName = UIFormat.FormatBiddenName(product.TopBidder);
  product.SellerName = UIFormat.FormatBiddenName(product.Seller);
  let auctHistory = null,
    isOwn = false;
  if (product.Seller === user.email) isOwn = true;
  if (user.isBidder) {
    auctHistory = await mAuction.getAuctionHistory(proId);
    let index = 1;
    if (auctHistory != null) {
      auctHistory.forEach(e => {
        e.index = index++;
        e.BidTime = UIFormat.FormatDate(e.BidTime);
        e.Price = UIFormat.FormatMoney(e.Price);
        e.BidderName = UIFormat.FormatBiddenName(e.Bidder);
        e.isOwn = isOwn;
      });
    }
  }
  // Cook:
  // Cats:
  cats.forEach(e => {
    e.isActive = e.CatID === product.CatID ? true : false;
  });
  prodTypes.forEach(e => {
    e.cats = [];
    for (let cat of cats) {
      if (cat.TypeID === e.TypeID) {
        e.cats.push(cat);
      }
    }
  });
  const d = new Date();
  // To calculate the time difference of two dates
  var Difference_In_Time = product.EndTime.getTime() - d.getTime();
  // To calculate the no. of days between two dates
  product.EndDays = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
  // Render:
  res.render("general/product-detail", {
    home: true,
    user: user,
    isOwn: isOwn,
    prodTypes: prodTypes,
    product: product,
    auctHistory: auctHistory
  });
};

exports.getListResults = async (req, res, next) => {
  // Authenticate User first:
  const user = funcs.authUser(req);
  const page = parseInt(req.query.page) || 1;
  // Get Table Essential:
  const prodTypes = await mCat.getProductType();
  const cats = await mCat.getCategory();
  // const products = await mProd.getProductsByName(req.query.search);
  const rs = await mProd.getAllByNamePaging(req.query.search, page);

  // pagination:
  const p = funcs.pageNav(page, rs.pageTotal);
  // Cats:
  prodTypes.forEach(e => {
    e.cats = [];
    for (let cat of cats) {
      if (cat.TypeID === e.TypeID) {
        e.cats.push(cat);
      }
    }
  });
  // Sort By:
  if (req.query.sortBy != undefined)
    funcs.SortBy(rs.products, req.query.sortBy);
  // Format UI:
  funcs.FormatList(rs.products);

  res.render("general/list-products-cat", {
    option: req.query.sortBy,
    home: true,
    user: user,
    isSearch: true,
    searchKey: req.query.search,
    products: rs.products,
    prodTypes: prodTypes,
    pages: p.pages,
    navs: p.navs
  });
};
