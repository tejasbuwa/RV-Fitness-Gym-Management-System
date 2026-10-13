const { pool } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

async function getPosts(req, res, next) {
  try {
    const { category = '' } = req.query;
    let sql = `SELECT * FROM posts WHERE is_published = 1`;
    const params = [];

    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY publish_date DESC, id DESC`;
    const [posts] = await pool.execute(sql, params);

    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
}

async function createPost(req, res, next) {
  try {
    const { title, category = 'update', content, imageUrl, publishDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const dateStr = publishDate || new Date().toISOString().split('T')[0];

    const [result] = await pool.execute(
      `INSERT INTO posts (title, category, content, image_url, is_published, publish_date, created_by_user_id)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [title.trim(), category, content.trim(), imageUrl || null, dateStr, req.user.id]
    );

    await logAudit({
      userId: req.user.id,
      action: 'POST_CREATED',
      entityType: 'posts',
      entityId: result.insertId,
      details: { title, category },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Post published successfully.',
      postId: result.insertId
    });
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    await pool.execute(`DELETE FROM posts WHERE id = ?`, [postId]);
    res.json({ success: true, message: 'Post removed.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPosts, createPost, deletePost };
