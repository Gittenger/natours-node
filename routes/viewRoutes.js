const express = require('express');
const viewController = require('../controllers/viewController.js');
const authController = require('../controllers/authController');

const { isLoggedIn } = authController;

const { getOverview, getTour, getLogin } = viewController;

const router = express.Router();

router.use(isLoggedIn);
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLogin);

module.exports = router;
