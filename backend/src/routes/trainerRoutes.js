const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public route to view trainers
router.get('/', trainerController.getTrainers);
router.get('/:id', trainerController.getTrainerById);

// Protected routes (Admin only)
router.post('/', verifyToken, authorizeRoles('admin'), trainerController.createTrainer);
router.put('/:id', verifyToken, authorizeRoles('admin'), trainerController.updateTrainer);
router.patch('/:id/status', verifyToken, authorizeRoles('admin'), trainerController.toggleTrainerStatus);

module.exports = router;
