const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', eventController.getEvents);
router.post('/', verifyToken, authorizeRoles('admin'), eventController.createEvent);
router.delete('/:id', verifyToken, authorizeRoles('admin'), eventController.deleteEvent);

module.exports = router;
