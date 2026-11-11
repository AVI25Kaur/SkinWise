var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var multer = require("multer");
var cloudinary = require("cloudinary");

var upload = multer({
  storage: multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  }),
  fileFilter: function(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return callback(new Error("Only image files are allowed!"), false);
    }
    return callback(null, true);
  }
});

cloudinary.config({
  cloud_name: "dmrien29n",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

function uploadAvatar(file) {
  return new Promise(function(resolve, reject) {
    cloudinary.v2.uploader.upload(
      file.path,
      { width: 400, height: 400, gravity: "center", crop: "scale" },
      function(error, result) {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      },
      { moderation: "webpurify" }
    );
  });
}

function loginUser(req, user) {
  return new Promise(function(resolve, reject) {
    req.login(user, function(error) {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

router.get("/", function(req, res) {
  if (req.user) {
    return res.redirect("/campgrounds");
  }
  return res.render("landing");
});

router.get("/about", function(req, res) {
  res.render("about");
});

router.get("/register", function(req, res) {
  if (req.user) {
    return res.redirect("/campgrounds");
  }
  return res.render("register");
});

router.post(
  "/register",
  upload.single("image"),
  middleware.asyncHandler(async function(req, res) {
    if (!req.body.username || !req.body.password || !req.body.email) {
      req.flash("error", "Username, email, and password are required.");
      return res.redirect("/register");
    }
    var avatar = req.file ? await uploadAvatar(req.file) : null;
    try {
      var user = await User.create({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        fullName: req.body.fullName,
        image: avatar ? avatar.secure_url : "",
        imageId: avatar ? avatar.public_id : ""
      }, req.body.password);
      await loginUser(req, user);
      return res.redirect("/campgrounds");
    } catch (error) {
      if (error.code === "23505") {
        req.flash("error", "That username is already taken.");
        return res.redirect("/register");
      }
      throw error;
    }
  })
);

router.get("/login", function(req, res) {
  if (req.user) {
    return res.redirect("/campgrounds");
  }
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", function(req, res) {
  req.logout();
  return res.redirect("/");
});

router.get(
  "/users/:user_id",
  middleware.asyncHandler(async function(req, res) {
    var user = await User.findById(req.params.user_id);
    if (!user) {
      req.flash("error", "This user doesn't exist");
      return res.status(404).render("error");
    }
    var campgrounds = await Campground.findAll({ authorId: user._id });
    var reviews = await Comment.findByAuthor(user._id);
    return res.render("users/show", {
      user: user,
      campgrounds: campgrounds,
      reviews: reviews
    });
  })
);

router.get(
  "/users/:user_id/edit",
  middleware.isLoggedIn,
  middleware.checkProfileOwnership,
  function(req, res) {
    res.render("users/edit", { user: req.profile });
  }
);

router.put(
  "/users/:user_id",
  middleware.isLoggedIn,
  upload.single("image"),
  middleware.checkProfileOwnership,
  middleware.asyncHandler(async function(req, res) {
    var image = req.profile.image;
    var imageId = req.profile.imageId;
    if (req.file) {
      var uploaded = await uploadAvatar(req.file);
      if (imageId) {
        await cloudinary.v2.uploader.destroy(imageId);
      }
      image = uploaded.secure_url;
      imageId = uploaded.public_id;
    }
    await User.update(req.params.user_id, {
      email: req.body.email,
      phone: req.body.phone,
      fullName: req.body.fullName,
      image: image,
      imageId: imageId
    });
    req.flash("success", "Updated your profile!");
    return res.redirect("/users/" + req.params.user_id);
  })
);

router.delete(
  "/users/:user_id",
  middleware.isLoggedIn,
  middleware.checkProfileOwnership,
  middleware.asyncHandler(async function(req, res) {
    if (req.profile.imageId) {
      await cloudinary.v2.uploader.destroy(req.profile.imageId);
    }
    await User.delete(req.params.user_id);
    req.logout();
    return res.redirect("/");
  })
);

module.exports = router;
