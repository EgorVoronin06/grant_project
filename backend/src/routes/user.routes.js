import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware.js';
import pool from '../config/database.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, skill_level, preferences, created_at, updated_at 
       FROM users WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', [
  authenticateToken,
  body('name').optional().trim().notEmpty(),
  body('skillLevel').optional().isIn(['beginner', 'intermediate', 'advanced']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, skillLevel, preferences } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (skillLevel) {
      updates.push(`skill_level = $${paramCount++}`);
      values.push(skillLevel);
    }

    if (preferences) {
      updates.push(`preferences = $${paramCount++}`);
      values.push(JSON.stringify(preferences));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user.userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, email, name, skill_level, preferences, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({ 
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get progress stats
    const progressStats = await pool.query(
      `SELECT 
        COUNT(*) as total_lessons_completed,
        SUM(score) as total_score,
        AVG(score) as average_score,
        MAX(completed_at) as last_completed_at
       FROM user_progress 
       WHERE user_id = $1`,
      [userId]
    );

    // Get achievements count
    const achievementsCount = await pool.query(
      `SELECT COUNT(*) as total_achievements 
       FROM user_achievements 
       WHERE user_id = $1`,
      [userId]
    );

    // Get current streak
    const streakResult = await pool.query(
      `SELECT COUNT(DISTINCT DATE(completed_at)) as current_streak
       FROM user_progress 
       WHERE user_id = $1 
       AND completed_at >= CURRENT_DATE - INTERVAL '30 days'`,
      [userId]
    );

    res.json({
      progress: progressStats.rows[0],
      achievements: achievementsCount.rows[0],
      streak: streakResult.rows[0],
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

