const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public route to view plans
router.get('/', planController.getPlans);

// Protected routes (Admin only)
router.post('/', verifyToken, authorizeRoles('admin'), planController.createPlan);
router.put('/:id', verifyToken, authorizeRoles('admin'), planController.updatePlan);
router.patch('/:id/status', verifyToken, authorizeRoles('admin'), planController.togglePlanStatus);

module.exports = router;
