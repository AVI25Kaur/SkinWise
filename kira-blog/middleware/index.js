var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var middlewareObj = {};

middlewareObj.asyncHandler = function(handler) {
  return function(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

middlewareObj.checkCampgroundOwnership = middlewareObj.asyncHandler(
  async function(req, res, next) {
    var campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Sorry, that campground does not exist!");
      return res.redirect("/campgrounds");
    }
    if (
      String(campground.author.id) === String(req.user._id) ||
      req.user.isAdmin
    ) {
      req.campground = campground;
      return next();
    }
    req.flash("error", "You don't have permission to do that!");
    return res.redirect("/campgrounds/" + req.params.id);
  }
);

middlewareObj.checkCommentOwnership = middlewareObj.asyncHandler(
  async function(req, res, next) {
    var comment = await Comment.findById(req.params.comment_id);
    if (!comment) {
      req.flash("error", "Sorry, that comment does not exist!");
      return res.redirect("/campgrounds");
    }
    if (
      String(comment.author.id) === String(req.user._id) ||
      req.user.isAdmin
    ) {
      req.comment = comment;
      return next();
    }
    req.flash("error", "You don't have permission to do that!");
    return res.redirect("/campgrounds/" + req.params.id);
  }
);

middlewareObj.checkProfileOwnership = middlewareObj.asyncHandler(
  async function(req, res, next) {
    var user = await User.findById(req.params.user_id);
    if (!user) {
      req.flash("error", "Sorry, that user doesn't exist");
      return res.redirect("/campgrounds");
    }
    if (String(user._id) === String(req.user._id) || req.user.isAdmin) {
      req.profile = user;
      return next();
    }
    req.flash("error", "You don't have permission to do that!");
    return res.redirect("/campgrounds/" + req.params.user_id);
  }
);

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  return res.redirect("/login");
};

module.exports = middlewareObj;
