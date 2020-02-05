const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//INITIALIZE ROUTER
//mergeParams will give access to params from earlier in URL from re-routing
const router = express.Router({ mergeParams: true });

//METHOD DEPENDENCIES
const {
  getAllReviews,
  createReview,
  setTourAndUserId,
  updateReview,
  deleteReview
} = reviewController;

const { protect, restrictTo } = authController;

////
//ROUTE MIDDLEWARE
//
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourAndUserId, createReview);
router
  .route('/:id')
  .get(updateReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
