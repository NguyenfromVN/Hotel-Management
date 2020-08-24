const passport = require("passport");
const funcs = require("../utils/ctr-function");
const hash = require("../utils/hash");
const mAccount = require("../models/account-model");

exports.getLogin = (req, res, next) => {
  const user = funcs.authUser(req);
  // Render views:
  res.render("general/sign-in", {
    user: user,
    layout: "sign-in-layout.hbs"
  });
};

exports.getRegister = (req, res, next) => {
  const user = funcs.authUser(req);
  // Render views:
  res.render("general/register", {
    user: user,
    layout: "sign-in-layout.hbs"
  });
};

// Login Controller:
exports.postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/sign-in"
});

exports.PostRegister = async (req, res, next) => {
  if (req.body.password != req.body.confirmPass)
    return res.redirect("/register");
  const email = req.body.email;
  const password = req.body.password;
  const pwHash = hash.getHashWithSalt(password, email);
  const salt = new Date();
  const user = {
    Email: email,
    UName: req.body.uname,
    Sex: req.body.sex,
    DoB: req.body.birthDay,
    Address: req.body.address,
    UpVote: 0,
    DownVote: 0,
    Pass: pwHash,
    Degree: "Bidder",
    Phone: req.body.phone,
    Salt: salt
  };

  // Check decouple this email:
  const check = await funcs.checkUser(user);

  // Add Account into database:
  if (check) await mAccount.add(user);
  else return res.redirect("/register");
  res.redirect("/sign-in");
};

// Logout Controller:
exports.getLogout = (req, res) => {
  if (!req.user) res.redirect("/sign-in");
  else {
    req.logOut();
    res.redirect("/sign-in");
  }
};
