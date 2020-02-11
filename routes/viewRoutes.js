const express = require('express');
const viewController = require('../controllers/viewController.js');

const { getOverview, getTour, getLogin } = viewController;

const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLogin);

module.exports = router;
