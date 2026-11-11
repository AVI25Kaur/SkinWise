var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");
var multer = require("multer");
var cloudinary = require("cloudinary");
var Fuse = require("fuse.js");

var geocoder = NodeGeocoder({
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEO_CODE_API,
  formatter: null
});
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
  cloud_name: "skull",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

function uploadImage(file, options) {
  return new Promise(function(resolve, reject) {
    cloudinary.v2.uploader.upload(
      file.path,
      options,
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

async function geocodeLocation(location) {
  if (!location) {
    return { location: "", lat: null, lng: null };
  }
  var results = await geocoder.geocode(location);
  if (!results.length) {
    throw new Error("Invalid address");
  }
  return {
    location: results[0].formattedAddress,
    lat: results[0].latitude,
    lng: results[0].longitude
  };
}

router.get(
  "/",
  middleware.asyncHandler(async function(req, res) {
    var sortBy = req.query.sortby;
    var campgrounds = await Campground.findAll({ sortBy: sortBy });
    var noMatch = null;
    if (req.query.search) {
      var fuse = new Fuse(campgrounds, {
        shouldSort: true,
        threshold: 0.5,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        keys: ["name", "location"]
      });
      campgrounds = fuse.search(req.query.search);
      if (!campgrounds.length) {
        noMatch = req.query.search;
      }
    }
    return res.render("campgrounds/index", {
      campgrounds: campgrounds,
      currentUser: req.user,
      noMatch: noMatch
    });
  })
);

router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("image"),
  middleware.asyncHandler(async function(req, res) {
    var values = req.body.campground || {};
    if (!req.file || !values.name || !values.description) {
      req.flash("error", "A title, description, and image are required.");
      return res.redirect("/campgrounds/new");
    }
    var coordinates;
    try {
      coordinates = await geocodeLocation(values.location);
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/campgrounds/new");
    }
    var image = await uploadImage(req.file, {
      width: 1500,
      height: 1000,
      crop: "scale"
    });
    await Campground.create(Object.assign({}, values, coordinates, {
      image: image.secure_url,
      imageId: image.public_id,
      booking: { start: values.start, end: values.end },
      tags: (values.tags || "").split(",").map(function(tag) {
        return tag.trim();
      }).filter(Boolean)
    }), req.user);
    return res.redirect("/campgrounds");
  })
);

router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  middleware.asyncHandler(async function(req, res) {
    var campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Sorry, that campground does not exist!");
      return res.status(404).render("error");
    }
    campground.comments = await Comment.findByCampground(req.params.id);
    if (campground.comments.length) {
      campground.rateAvg = campground.comments.reduce(function(total, comment) {
        return total + comment.rating;
      }, 0) / campground.comments.length;
      campground.rateCount = campground.comments.length;
    }
    return res.render("campgrounds/show", { campground: campground });
  })
);

router.get(
  "/:id/edit",
  middleware.isLoggedIn,
  middleware.checkCampgroundOwnership,
  function(req, res) {
    res.render("campgrounds/edit", { campground: req.campground });
  }
);

router.put(
  "/:id",
  middleware.isLoggedIn,
  upload.single("image"),
  middleware.checkCampgroundOwnership,
  middleware.asyncHandler(async function(req, res) {
    var values = req.body.campground || {};
    var coordinates;
    try {
      coordinates = await geocodeLocation(values.location || req.campground.location);
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/campgrounds/" + req.params.id + "/edit");
    }
    var imageUrl = req.campground.image;
    var imageId = req.campground.imageId;
    if (req.file) {
      var uploaded = await uploadImage(req.file, {
        width: 1500,
        height: 1000,
        crop: "scale"
      });
      if (imageId) {
        await cloudinary.v2.uploader.destroy(imageId);
      }
      imageUrl = uploaded.secure_url;
      imageId = uploaded.public_id;
    }
    await Campground.update(req.params.id, Object.assign({}, req.campground, values, coordinates, {
      image: imageUrl,
      imageId: imageId,
      booking: { start: values.start, end: values.end },
      tags: values.tags ? values.tags.split(",").map(function(tag) {
        return tag.trim();
      }).filter(Boolean) : req.campground.tags
    }));
    req.flash("success", "Successfully updated your campground!");
    return res.redirect("/campgrounds/" + req.params.id);
  })
);

router.delete(
  "/:id",
  middleware.isLoggedIn,
  middleware.checkCampgroundOwnership,
  middleware.asyncHandler(async function(req, res) {
    if (req.campground.imageId) {
      await cloudinary.v2.uploader.destroy(req.campground.imageId);
    }
    await Campground.delete(req.params.id);
    return res.redirect("/campgrounds");
  })
);

module.exports = router;
