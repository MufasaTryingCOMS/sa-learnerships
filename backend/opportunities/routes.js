const express = require('express');
const opportunitiesController = require('./controller.js');

const router = express.Router();
const createOpportunity = opportunitiesController.createOpportunity;
const getOpportunity = opportunitiesController.getOpportunity;

router.post('', createOpportunity);
router.get('/:id', getOpportunity);

module.exports = router;
