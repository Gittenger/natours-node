const express = require('express');
const viewController = require('../controllers/viewController.js');
const authController = require('../controllers/authController');

const { protect } = authController;

const { getOverview, getTour, getLogin } = viewController;

const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', protect, getTour);
router.get('/login', getLogin);

module.exports = router;
