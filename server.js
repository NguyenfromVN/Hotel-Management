//Express Framework:
const express = require("express");
const app = express();
// Body Parser module:
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
//Handlebars template engine:
const expressHbs = require("express-handlebars");
const hbs = require("handlebars");
//Set wiews and name for handlbars:
app.engine(
  "hbs",
  expressHbs({
    defaultLayout: "main",
    extname: "hbs",
    helpers: {
      Selected: function(inpval, option) {
        if (inpval === option) return "selected";
      }
    }
  })
);
// hbs.registerHelper("Seleted", function(inpval, option) {
//   if (inpval === option) return new hbs.SafeString("selected");
// });
app.set("view engine", "hbs");
app.set("views", "views");
// Helpers Handlebars:

// Express-session:
const session = require("express-session");
app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false })
);
// PassportJS:
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const account = require("./models/account-model");
const hash = require("./utils/hash");

// Serialize all User in session
passport.serializeUser(function(user, done) {
  done(null, { email: user.Email, level: user.Degree });
});

// Deserialize for unique use via cookie:
passport.deserializeUser(async (userObj, done) => {
  const user = await account.getUserByEmail(userObj.email);
  done(null, user);
});

passport.use(
  new localStrategy(async (email, password, done) => {
    const user = await account.getUserByEmail(email);
    if (user === null) {
      return done(null, false, { message: "Incorrect username." });
    }
    if (!hash.cmpPassword(password, user.Pass, user.Email)) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  })
);

//Set public static:
app.use(express.static(__dirname + "/public"));
// Set Passportjs
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//-----------------------------//
//Set routes:
app.use(require("./routes/guest-routes"));
app.use(require("./routes/bidder-routes"));
app.use(require("./routes/seller-routes"));
app.use(require("./routes/admin-routes"));
//Use router:

const port = 4000;
app.listen(port, () => console.log(`App listening on port ${port}`));
