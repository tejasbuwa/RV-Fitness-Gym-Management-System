const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'trainer'), memberController.getMembers);
router.get('/:id', authorizeRoles('admin', 'trainer', 'member'), memberController.getMemberById);
router.post('/', authorizeRoles('admin'), memberController.createMember);
router.put('/:id', authorizeRoles('admin'), memberController.updateMember);
router.patch('/:id/status', authorizeRoles('admin'), memberController.toggleMemberStatus);
router.delete('/:id', authorizeRoles('admin'), memberController.deleteMember);

module.exports = router;
