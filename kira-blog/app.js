var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

require("dotenv").config();

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set before starting the server.");
}

var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var db = require("./db");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async function(username, password, done) {
    try {
      var user = await User.findByUsername(username);
      if (!user || !User.verifyPassword(user, password)) {
        return done(null, false, { message: "Invalid username or password." });
      }
      return done(null, {
        _id: String(user.id),
        id: String(user.id),
        username: user.username,
        email: user.email,
        phone: user.phone,
        fullName: user.full_name,
        image: user.image,
        imageId: user.image_id,
        joined: user.joined,
        isAdmin: user.is_admin
      });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    done(null, user || false);
  }, done);
});

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get("*", function(req, res) {
  res.render("error");
});

app.use(function(error, req, res, next) {
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }
  req.flash("error", "Something went wrong.");
  return res.status(500).render("error");
});

async function start() {
  await db.initialize();
  app.listen(process.env.PORT || 3000, function() {
    console.log("The Server Has Started!");
  });
}

start().catch(function(error) {
  console.error("Could not start the server:", error);
  process.exitCode = 1;
});
