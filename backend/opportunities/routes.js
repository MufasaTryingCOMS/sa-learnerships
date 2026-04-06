const express = require('express');
const opportunitiesController = require('./controller.js');

const router = express.Router();
const createOpportunity = opportunitiesController.createOpportunity;

router.post('', createOpportunity);

module.exports = router;
