import express from 'express';
import { query, validationResult } from 'express-validator';
import { optionalAuth } from '../middleware/auth.middleware.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all courses
router.get('/', [
  optionalAuth,
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('category').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let queryText = 'SELECT * FROM courses WHERE 1=1';
    const queryParams = [];
    let paramCount = 1;

    if (req.query.level) {
      queryText += ` AND level = $${paramCount++}`;
      queryParams.push(req.query.level);
    }

    if (req.query.category) {
      queryText += ` AND category = $${paramCount++}`;
      queryParams.push(req.query.category);
    }

    queryText += ' ORDER BY order_index ASC, created_at DESC';

    const result = await pool.query(queryText, queryParams);

    // If user is authenticated, add progress info
    if (req.user) {
      const coursesWithProgress = await Promise.all(
        result.rows.map(async (course) => {
          const progressResult = await pool.query(
            `SELECT COUNT(*) as completed_lessons 
             FROM user_progress up
             JOIN lessons l ON up.lesson_id = l.id
             WHERE l.course_id = $1 AND up.user_id = $2`,
            [course.id, req.user.userId]
          );

          const totalLessonsResult = await pool.query(
            'SELECT COUNT(*) as total_lessons FROM lessons WHERE course_id = $1',
            [course.id]
          );

          return {
            ...course,
            progress: {
              completedLessons: parseInt(progressResult.rows[0].completed_lessons),
              totalLessons: parseInt(totalLessonsResult.rows[0].total_lessons),
            }
          };
        })
      );

      return res.json({ courses: coursesWithProgress });
    }

    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get course by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [req.params.id]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    // Get lessons for this course
    const lessonsResult = await pool.query(
      'SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index ASC',
      [req.params.id]
    );

    course.lessons = lessonsResult.rows;

    // If user is authenticated, add progress
    if (req.user) {
      const progressResult = await pool.query(
        `SELECT lesson_id, score, completed_at 
         FROM user_progress 
         WHERE user_id = $1 AND lesson_id IN (
           SELECT id FROM lessons WHERE course_id = $2
         )`,
        [req.user.userId, req.params.id]
      );

      const progressMap = {};
      progressResult.rows.forEach(p => {
        progressMap[p.lesson_id] = p;
      });

      course.lessons = course.lessons.map(lesson => ({
        ...lesson,
        progress: progressMap[lesson.id] || null,
      }));
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

