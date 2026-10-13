const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/dashboard/admin', verifyToken, authorizeRoles('admin'), reportController.getAdminDashboard);
router.get('/dashboard/trainer', verifyToken, authorizeRoles('trainer', 'admin'), reportController.getTrainerDashboard);
router.get('/dashboard/member', verifyToken, authorizeRoles('member'), reportController.getMemberDashboard);

router.get('/reports', verifyToken, authorizeRoles('admin'), reportController.getReports);
router.get('/audit-logs', verifyToken, authorizeRoles('admin'), reportController.getAuditLogs);

module.exports = router;
