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
  getMonthlyPlan
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
router.route('/monthly-plan/:year').get(getMonthlyPlan);

//CRUD ROUTES
router
  .route('/')
  .get(protect, getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('lead-guide', 'admin'), deleteTour);

module.exports = router;
