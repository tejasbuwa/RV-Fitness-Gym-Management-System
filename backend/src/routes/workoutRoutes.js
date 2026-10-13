const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(verifyToken);

router.get('/member/:memberId', workoutController.getWorkoutByMemberId);
router.post('/', authorizeRoles('admin', 'trainer'), workoutController.createWorkoutPlan);
router.delete('/:id', authorizeRoles('admin', 'trainer'), workoutController.deleteWorkoutPlan);

module.exports = router;
