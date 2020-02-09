const express = require('express');
const viewController = require('../controllers/viewController.js');

const { getOverview, getTour } = viewController;

const router = express.Router();

router.get('/', getOverview);
router.get('/tour', getTour);

module.exports = router;
