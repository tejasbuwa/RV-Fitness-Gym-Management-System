const express = require('express');
const router = express.Router();
const gymStatusController = require('../controllers/gymStatusController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', gymStatusController.getGymStatus);
router.put('/', verifyToken, authorizeRoles('admin'), gymStatusController.updateGymStatus);

module.exports = router;
