const express = require('express');
const viewController = require('../controllers/viewController.js');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const { isLoggedIn, protect } = authController;
const { createBookingCheckout } = bookingController;

const {
  getOverview,
  getTour,
  getLogin,
  getAccount,
  updateUserData
} = viewController;

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLogin);
router.get('/me', protect, getAccount);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
