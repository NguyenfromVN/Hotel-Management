const mAccount = require("../models/account-model");
const mWatchList = require("../models/watch-list-model");
const mProd = require("../models/products-model");
const mAuct = require("../models/auction-model");
const UIFuncs = require("../utils/UI-function");

exports.FormatList = list => {
  if (list != null) {
    const d = new Date();
    list.forEach(e => {
      //Calc Countdown Time:
      // To calculate the time difference of two dates
      var diff = e.EndTime.getTime() - d.getTime();
      // To calculate the no. of days between two dates
      e.EndDays = Math.floor(diff / (1000 * 3600 * 24));
      const h = Math.floor((diff / (1000 * 3600)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      e.EndFullTime = `${h}h${m}m${s}s`;
      //Format Money:
      e.CurrentPrice = UIFuncs.FormatMoney(e.CurrentPrice);
    });
  }
};

exports.SortBy = (list, type) => {
  switch (type) {
    case "end-inc":
      list.sort((a, b) => {
        return a.EndTime.getTime() - b.EndTime.getTime();
      });
      break;
    case "end-desc":
      list.sort((a, b) => {
        return b.EndTime.getTime() - a.EndTime.getTime();
      });
      break;
    case "price-inc":
      list.sort((a, b) => {
        return a.CurrentPrice - b.CurrentPrice;
      });
      break;
    case "price-desc":
      list.sort((a, b) => {
        return b.CurrentPrice - a.CurrentPrice;
      });
      break;
  }
};

// Authenticate Users depend req.session.passport:
exports.authUser = req => {
  let user = {
    isGuest: false,
    isBidder: false,
    isSeller: false,
    isAdmin: false,
    email: null,
    level: null
  };
  if (req.session.passport == null || req.session.passport.user == null)
    user.isGuest = true;
  else {
    user.level = req.session.passport.user.level;
    user.email = req.session.passport.user.email;
    switch (user.level) {
      case "Bidder":
        user.isBidder = true;
        break;
      case "Seller":
        user.isBidder = user.isSeller = true;
        break;
      case "Admin":
        user.isAdmin = true;
        break;
    }
    // Get Nick Name in Email:
    user.uname = user.email.split("@gmail.com")[0];
  }
  return user;
};

exports.checkUser = async user => {
  const acc = await mAccount.getUserByEmail(user.email);
  if (acc != null) return false;
  return true;
};

exports.checkWatchList = async prod => {
  const watchList = await mWatchList.getWatchList(prod.Email);
  if (watchList === null) return true;
  const index = watchList.findIndex(e => e.ProID === prod.ProID);
  if (index === -1) return true;
  return false;
};

exports.checkAuctionCondition = async (price, proId, user) => {
  // Check user is Owner of this product:
  const product = await mProd.getProductsById(proId);
  if (user.email === product.Seller) return false;
  // Check User JudgedCore > 80%
  const acc = await mAccount.getUserByEmail(user.email);
  if (acc.UpVote + acc.DownVote > 10 && acc.UpVote / acc.DownVote < 0.8)
    return false;
  // Check Ban Person:
  const checkBan = await mAuct.getBanPerson(proId, user.email);
  if (price >= product.CurrentPrice + product.PriceStep && checkBan === null) {
    // Change CurrentPrice:
    product.CurrentPrice = price;
    // Increase BidCount:
    product.BidCount += 1;
    // If seller wanna auto plus entime:

    // ...

    // Check Purchase price:
    if (product.CurrentPrice >= product.PurchasePrice) product.IsDeleted = 1;
    // Update Top Bidder Currents:
    product.TopBidder = user.email;
    // Update this entity:
    await mProd.update(product);
    return true;
  }
  return false;
};

// Pagination:
exports.pageNav = (page, pageTotal) => {
  // Pages:
  const pages = [];
  for (let i = 0; i < pageTotal; i++) {
    pages[i] = { value: i + 1, active: i + 1 === page };
  }
  const navs = {};
  if (pages > 1) {
    navs.prev = page - 1;
  }
  if (pages < pageTotal) {
    navs.next = page + 1;
  }
  return {
    pages: pages,
    navs: navs
  };
};
