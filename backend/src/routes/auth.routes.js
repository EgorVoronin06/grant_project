import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, getProfile, updateProfile, getUserProgress, getUserAchievements } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty(),
  body('phone').optional().isMobilePhone('ru-RU'),
  body('birth_date').optional().isISO8601(),
  body('skill_level').optional().isIn(['beginner', 'intermediate', 'advanced'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  await register(req, res);
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  await login(req, res);
});

// Protected routes
router.use(authenticateToken);

// Get current user profile (full)
router.get('/me', getProfile);

// Update profile
router.put('/me', updateProfile);

// Get user progress
router.get('/progress', getUserProgress);

// Get user achievements
router.get('/achievements', getUserAchievements);

export default router;

