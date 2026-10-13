const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/payments', verifyToken, paymentController.getPayments);
router.post('/payments', verifyToken, authorizeRoles('admin'), paymentController.recordPayment);

router.get('/receipts', verifyToken, paymentController.getReceipts);
router.get('/receipts/:id', verifyToken, paymentController.getReceiptById);

module.exports = router;
