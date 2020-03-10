const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

//METHOD DEPENDENCIES
const { protect, restrictTo } = authController;

const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getCheckoutSession
} = bookingController;

//PROTECT FOLLOWING ROUTES
router.use(protect);

router.get('/checkout-session/:tourId', getCheckoutSession);

//RESTRICT FOLLOWING ROUTES TO ADMIN ONLY
router.use(restrictTo('admin', 'lead-guides'));

router
  .route('/')
  .get(getAllBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = router;
