import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';
import pool from '../config/database.js';

const router = express.Router();

// Save recognition attempt
router.post('/attempt', [
  optionalAuth,
  body('signId').optional().isInt(),
  body('frameData').isArray(),
  body('predictedSign').optional().trim(),
  body('confidence').optional().isFloat({ min: 0, max: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { signId, frameData, predictedSign, confidence } = req.body;
    const userId = req.user?.userId || null;

    // Save recognition attempt
    const result = await pool.query(
      `INSERT INTO recognition_attempts (user_id, sign_id, frame_data, predicted_sign, confidence, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [
        userId,
        signId || null,
        JSON.stringify(frameData),
        predictedSign || null,
        confidence || null
      ]
    );

    res.json({
      message: 'Recognition attempt saved',
      attempt: result.rows[0]
    });
  } catch (error) {
    console.error('Save recognition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recognition feedback
router.post('/feedback', [
  optionalAuth,
  body('frameData').isArray(),
  body('expectedSign').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { frameData, expectedSign } = req.body;

    // Here you would integrate with your ML model for gesture recognition
    // For now, return a mock response
    // In production, this would call your TensorFlow/MediaPipe model

    const mockFeedback = {
      recognized: true,
      predictedSign: expectedSign || 'example_sign',
      confidence: 0.85,
      feedback: {
        accuracy: 0.85,
        suggestions: [
          'Try to keep your hand more steady',
          'Make sure all fingers are visible'
        ],
        isCorrect: expectedSign ? true : null
      }
    };

    res.json(mockFeedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recognition history for user
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ra.*, ds.word as sign_word
       FROM recognition_attempts ra
       LEFT JOIN dictionary_signs ds ON ra.sign_id = ds.id
       WHERE ra.user_id = $1
       ORDER BY ra.created_at DESC
       LIMIT 50`,
      [req.user.userId]
    );

    res.json({ attempts: result.rows });
  } catch (error) {
    console.error('Get recognition history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

