const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

//METHOD DEPENDENCIES
const { protect } = authController;

const { getCheckoutSession } = bookingController;

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

module.exports = router;
