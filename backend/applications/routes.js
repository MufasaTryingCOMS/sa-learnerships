const express = require('express');
const applicationsController = require('./controller.js');
const { verifyToken } = require('../middlewares/auth.js');

const router = express.Router();

const submitApplication = applicationsController.submitApplication;
const getApplicationsForOpportunity = applicationsController.getApplicationsForOpportunity;

router.post('/:id/apply', verifyToken, submitApplication);
router.get('/:id/applications', verifyToken, getApplicationsForOpportunity);

module.exports = router;