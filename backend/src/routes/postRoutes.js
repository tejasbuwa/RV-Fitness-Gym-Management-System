const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', postController.getPosts);
router.post('/', verifyToken, authorizeRoles('admin'), postController.createPost);
router.delete('/:id', verifyToken, authorizeRoles('admin'), postController.deletePost);

module.exports = router;
