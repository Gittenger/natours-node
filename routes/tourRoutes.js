const express = require('express');
const reviewRouter = require('../routes/reviewRoutes');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

//INITIALIZE ROUTER
const router = express.Router();

//reroute to reviews route if creating review on tour
router.use('/:tourId/reviews', reviewRouter);

//METHOD DEPENDENCIES
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages
} = tourController;

const { protect, restrictTo } = authController;

////
//ROUTE MIDDLEWARE
//
//show top five tours
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
//overall tour stats
router.route('/tour-stats').get(getTourStats);
//optimal monthly plan for a given year
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('lead-guide', 'admin', 'guide'), getMonthlyPlan);

//tours within distance
//ex: NY coords == 40.7128,-74.0060
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

//calculate distance of tours from a point
router.route('/distances/:latlng/unit/:unit').get(getDistances);

//CRUD ROUTES
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('lead-guide', 'admin'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('lead-guide', 'admin'), deleteTour);

module.exports = router;
