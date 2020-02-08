const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//INITIALIZE ROUTER
//mergeParams will give access to params from earlier in URL from re-routing
//for creating review on tour
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
//PROTECT ALL ROUTES
router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourAndUserId, createReview);
router
  .route('/:id')
  .get(updateReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
