const express = require('express');
const router = express.Router();
const { processTransaction } = require('../controllers/transactionController');

// POST /transactions — process a fare payment
router.post('/', processTransaction);

module.exports = router;