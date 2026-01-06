import express from 'express';
import { optionalAuth, authenticateToken } from '../middleware/auth.middleware.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all lessons (optionally filtered by course)
router.get('/', optionalAuth, async (req, res) => {
  try {
    let queryText = 'SELECT * FROM lessons WHERE 1=1';
    const queryParams = [];
    let paramCount = 1;

    if (req.query.courseId) {
      queryText += ` AND course_id = $${paramCount++}`;
      queryParams.push(req.query.courseId);
    }

    queryText += ' ORDER BY order_index ASC';

    const result = await pool.query(queryText, queryParams);

    res.json({ lessons: result.rows });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lesson by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM lessons WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const lesson = result.rows[0];

    // If user is authenticated, get progress
    if (req.user) {
      const progressResult = await pool.query(
        'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2 ORDER BY completed_at DESC LIMIT 1',
        [req.user.userId, req.params.id]
      );

      if (progressResult.rows.length > 0) {
        lesson.progress = progressResult.rows[0];
      }
    }

    res.json({ lesson });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

