const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Can be queried publicly or authenticated
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return verifyToken(req, res, () => noticeController.getNotices(req, res, next));
  }
  noticeController.getNotices(req, res, next);
});

router.post('/', verifyToken, authorizeRoles('admin'), noticeController.createNotice);
router.delete('/:id', verifyToken, authorizeRoles('admin'), noticeController.deleteNotice);

module.exports = router;
