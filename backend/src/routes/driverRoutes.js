const express = require('express');
const router = express.Router();
const {
  getDriverSummary,
  getDriverTransactions,
  getDriver,
  updateCurrentLeg,
} = require('../controllers/driverController');

router.get('/:id', getDriver);
router.get('/:id/summary', getDriverSummary);
router.get('/:id/transactions', getDriverTransactions);
router.patch('/:id/current-leg', updateCurrentLeg);

module.exports = router;