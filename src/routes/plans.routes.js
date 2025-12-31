const express = require('express');
const router = express.Router();
const plansController = require('../controllers/plans.controller');

router.post('/plans', plansController.addPlan);
router.get('/plans/:id', plansController.getPlan);
router.patch('/plans/:id/steps/:stepId', plansController.updateStepStatus);

module.exports = router;
