const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(verifyToken);

router.get('/member/:memberId', progressController.getProgressByMemberId);
router.post('/', authorizeRoles('admin', 'trainer'), progressController.recordProgress);
router.delete('/:id', authorizeRoles('admin', 'trainer'), progressController.deleteProgress);

module.exports = router;
