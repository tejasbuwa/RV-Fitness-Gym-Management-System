const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(verifyToken);

router.get('/member/:memberId', dietController.getDietByMemberId);
router.post('/', authorizeRoles('admin', 'trainer'), dietController.createDietPlan);
router.delete('/:id', authorizeRoles('admin', 'trainer'), dietController.deleteDietPlan);

module.exports = router;
