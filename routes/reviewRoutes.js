const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//mergeParams will give access to params from earlier in URL from re-routing
const router = express.Router({ mergeParams: true });

const { getAllReviews, createReview } = reviewController;
const { protect, restrictTo } = authController;

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
