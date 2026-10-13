const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(verifyToken);

router.get('/', membershipController.getMemberships);
router.post('/assign', authorizeRoles('admin'), membershipController.assignMembership);
router.post('/renew', authorizeRoles('admin'), membershipController.renewMembership);
router.patch('/:id/cancel', authorizeRoles('admin'), membershipController.cancelMembership);

module.exports = router;
