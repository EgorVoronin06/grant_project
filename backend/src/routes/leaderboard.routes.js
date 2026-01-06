import express from 'express';
import { query, validationResult } from 'express-validator';
import { optionalAuth } from '../middleware/auth.middleware.js';
import pool from '../config/database.js';

const router = express.Router();

// Get leaderboard
router.get('/', [
  optionalAuth,
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'all']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const period = req.query.period || 'all';
    const limit = parseInt(req.query.limit) || 50;

    let dateFilter = '';
    if (period === 'daily') {
      dateFilter = "AND up.completed_at >= CURRENT_DATE";
    } else if (period === 'weekly') {
      dateFilter = "AND up.completed_at >= CURRENT_DATE - INTERVAL '7 days'";
    } else if (period === 'monthly') {
      dateFilter = "AND up.completed_at >= CURRENT_DATE - INTERVAL '30 days'";
    }

    const result = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(DISTINCT up.lesson_id) as lessons_completed,
        SUM(up.score) as total_score,
        AVG(up.score) as average_score,
        COUNT(DISTINCT ua.achievement_id) as achievements_count
       FROM users u
       LEFT JOIN user_progress up ON u.id = up.user_id ${dateFilter}
       LEFT JOIN user_achievements ua ON u.id = ua.user_id
       GROUP BY u.id, u.name, u.email
       HAVING COUNT(DISTINCT up.lesson_id) > 0
       ORDER BY total_score DESC, lessons_completed DESC
       LIMIT $1`,
      [limit]
    );

    // Add user's position if authenticated
    let userPosition = null;
    if (req.user) {
      const userResult = await pool.query(
        `SELECT 
          COUNT(*) + 1 as position
         FROM (
           SELECT 
             u.id,
             SUM(up.score) as total_score,
             COUNT(DISTINCT up.lesson_id) as lessons_completed
           FROM users u
           LEFT JOIN user_progress up ON u.id = up.user_id ${dateFilter}
           GROUP BY u.id
           HAVING COUNT(DISTINCT up.lesson_id) > 0
           AND (SUM(up.score) > (
             SELECT SUM(up2.score) 
             FROM user_progress up2 
             WHERE up2.user_id = $1 ${dateFilter}
           ) OR (SUM(up.score) = (
             SELECT SUM(up2.score) 
             FROM user_progress up2 
             WHERE up2.user_id = $1 ${dateFilter}
           ) AND COUNT(DISTINCT up.lesson_id) > (
             SELECT COUNT(DISTINCT up3.lesson_id) 
             FROM user_progress up3 
             WHERE up3.user_id = $1 ${dateFilter}
           )))
         ) ranked_users`,
        [req.user.userId]
      );

      if (userResult.rows.length > 0) {
        userPosition = parseInt(userResult.rows[0].position);
      }
    }

    res.json({
      leaderboard: result.rows,
      period,
      userPosition
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

