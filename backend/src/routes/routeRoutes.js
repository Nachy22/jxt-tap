const express = require('express');
const router = express.Router();
const { getRouteLegs } = require('../controllers/routeController');

router.get('/:id/legs', getRouteLegs);

module.exports = router;