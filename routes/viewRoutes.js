const express = require('express');
const viewController = require('../controllers/viewController.js');
const authController = require('../controllers/authController');

const { isLoggedIn, protect } = authController;

const {
  alerts,
  getOverview,
  getTour,
  getLogin,
  getAccount,
  getMyTours,
  updateUserData
} = viewController;

const router = express.Router();

//allow custom alert messages to be passed into res.locals for all views
router.use(alerts);

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLogin);
router.get('/me', protect, getAccount);
router.get('/my-tours', /*createBookingCheckout,*/ protect, getMyTours);

router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
