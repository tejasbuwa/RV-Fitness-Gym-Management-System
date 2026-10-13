const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(verifyToken);

router.get('/', billingController.getInvoices);
router.get('/:id', billingController.getInvoiceById);
router.post('/', authorizeRoles('admin'), billingController.createInvoice);
router.patch('/:id/cancel', authorizeRoles('admin'), billingController.cancelInvoice);

module.exports = router;
