var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get(
  "/new",
  middleware.isLoggedIn,
  middleware.asyncHandler(async function(req, res) {
    var campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Sorry, that campground does not exist!");
      return res.redirect("/campgrounds");
    }
    return res.render("comments/new", { campground: campground });
  })
);

router.post(
  "/",
  middleware.isLoggedIn,
  middleware.asyncHandler(async function(req, res) {
    var campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Sorry, that campground does not exist!");
      return res.redirect("/campgrounds");
    }
    if (String(campground.author.id) === String(req.user._id)) {
      req.flash("error", "You cannot review your own post.");
      return res.redirect("/campgrounds/" + req.params.id);
    }
    if (await Comment.hasUserReviewed(req.params.id, req.user._id)) {
      req.flash(
        "error",
        "You've already reviewed this campground, please edit your review instead."
      );
      return res.redirect("/campgrounds/" + req.params.id);
    }

    var comment = req.body.comment || {};
    var rating = Number(comment.rating);
    if (!comment.text || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      req.flash("error", "Enter review text and choose a rating from 1 to 5.");
      return res.redirect("/campgrounds/" + req.params.id);
    }

    try {
      await Comment.create(req.params.id, req.user, {
        text: comment.text,
        rating: rating
      });
    } catch (error) {
      if (error.code === "23505") {
        req.flash("error", "You've already reviewed this campground.");
        return res.redirect("/campgrounds/" + req.params.id);
      }
      throw error;
    }
    await Campground.updateRating(req.params.id);
    req.flash("success", "Successfully added review!");
    return res.redirect("/campgrounds/" + req.params.id);
  })
);

router.get(
  "/:comment_id/edit",
  middleware.isLoggedIn,
  middleware.checkCommentOwnership,
  function(req, res) {
    res.render("comments/edit", {
      campground_id: req.params.id,
      comment: req.comment
    });
  }
);

router.put(
  "/:comment_id",
  middleware.isLoggedIn,
  middleware.checkCommentOwnership,
  middleware.asyncHandler(async function(req, res) {
    var comment = req.body.comment || {};
    var rating = Number(comment.rating);
    if (!comment.text || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      req.flash("error", "Enter review text and choose a rating from 1 to 5.");
      return res.redirect("/campgrounds/" + req.params.id);
    }
    await Comment.update(req.params.comment_id, req.user, {
      text: comment.text,
      rating: rating
    });
    await Campground.updateRating(req.params.id);
    req.flash("success", "Review updated!");
    return res.redirect("/campgrounds/" + req.params.id);
  })
);

router.delete(
  "/:comment_id",
  middleware.isLoggedIn,
  middleware.checkCommentOwnership,
  middleware.asyncHandler(async function(req, res) {
    var campgroundId = await Comment.delete(req.params.comment_id);
    if (campgroundId) {
      await Campground.updateRating(campgroundId);
    }
    req.flash("success", "Review deleted!");
    return res.redirect("/campgrounds/" + req.params.id);
  })
);

module.exports = router;
