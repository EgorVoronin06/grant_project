import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware.js';
import pool from '../config/database.js';

const router = express.Router();

// Save lesson progress
router.post('/', [
  authenticateToken,
  body('lessonId').isInt(),
  body('score').isFloat({ min: 0, max: 100 }),
  body('completed').optional().isBoolean(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lessonId, score, completed, recognitionData } = req.body;
    const userId = req.user.userId;

    // Check if lesson exists
    const lessonCheck = await pool.query(
      'SELECT id FROM lessons WHERE id = $1',
      [lessonId]
    );

    if (lessonCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Insert or update progress
    const result = await pool.query(
      `INSERT INTO user_progress (user_id, lesson_id, score, completed, recognition_data, completed_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id, lesson_id) 
       DO UPDATE SET 
         score = GREATEST(user_progress.score, EXCLUDED.score),
         completed = EXCLUDED.completed,
         recognition_data = EXCLUDED.recognition_data,
         completed_at = CASE WHEN EXCLUDED.completed THEN NOW() ELSE user_progress.completed_at END
       RETURNING *`,
      [
        userId,
        lessonId,
        score,
        completed || false,
        recognitionData ? JSON.stringify(recognitionData) : null
      ]
    );

    // Check for achievements
    await checkAndAwardAchievements(userId);

    res.json({
      message: 'Progress saved successfully',
      progress: result.rows[0]
    });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user progress for a lesson
router.get('/lesson/:lessonId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
      [req.user.userId, req.params.lessonId]
    );

    if (result.rows.length === 0) {
      return res.json({ progress: null });
    }

    res.json({ progress: result.rows[0] });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all user progress
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT up.*, l.title as lesson_title, l.course_id, c.title as course_title
       FROM user_progress up
       JOIN lessons l ON up.lesson_id = l.id
       LEFT JOIN courses c ON l.course_id = c.id
       WHERE up.user_id = $1
       ORDER BY up.completed_at DESC`,
      [req.user.userId]
    );

    res.json({ progress: result.rows });
  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user achievements
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ua.*, a.title, a.description, a.icon, a.points
       FROM user_achievements ua
       JOIN achievements a ON ua.achievement_id = a.id
       WHERE ua.user_id = $1
       ORDER BY ua.earned_at DESC`,
      [req.user.userId]
    );

    res.json({ achievements: result.rows });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to check and award achievements
async function checkAndAwardAchievements(userId) {
  try {
    // Check for various achievements
    const progressStats = await pool.query(
      `SELECT 
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed_lessons,
        AVG(score) as avg_score
       FROM user_progress 
       WHERE user_id = $1`,
      [userId]
    );

    const stats = progressStats.rows[0];
    const totalLessons = parseInt(stats.total_lessons);
    const completedLessons = parseInt(stats.completed_lessons);
    const avgScore = parseFloat(stats.avg_score) || 0;

    // Award achievements based on milestones
    const achievementsToCheck = [
      { condition: completedLessons >= 1, achievementType: 'first_lesson' },
      { condition: completedLessons >= 5, achievementType: 'five_lessons' },
      { condition: completedLessons >= 10, achievementType: 'ten_lessons' },
      { condition: completedLessons >= 25, achievementType: 'twenty_five_lessons' },
      { condition: avgScore >= 80, achievementType: 'high_score' },
    ];

    for (const check of achievementsToCheck) {
      if (check.condition) {
        // Get achievement ID
        const achievementResult = await pool.query(
          'SELECT id FROM achievements WHERE type = $1',
          [check.achievementType]
        );

        if (achievementResult.rows.length > 0) {
          const achievementId = achievementResult.rows[0].id;

          // Check if user already has this achievement
          const existingResult = await pool.query(
            'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
            [userId, achievementId]
          );

          if (existingResult.rows.length === 0) {
            // Award achievement
            await pool.query(
              'INSERT INTO user_achievements (user_id, achievement_id, earned_at) VALUES ($1, $2, NOW())',
              [userId, achievementId]
            );
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}

export default router;

