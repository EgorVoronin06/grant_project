import express from 'express';
import { query, validationResult } from 'express-validator';
import { optionalAuth } from '../middleware/auth.middleware.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all signs (with pagination and search)
router.get('/', [
  optionalAuth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let queryText = 'SELECT * FROM dictionary_signs WHERE 1=1';
    const queryParams = [];
    let paramCount = 1;

    if (search) {
      queryText += ` AND (word ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    queryText += ` ORDER BY word ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    const result = await pool.query(queryText, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM dictionary_signs WHERE 1=1';
    if (search) {
      countQuery += ` AND (word ILIKE $1 OR description ILIKE $1)`;
      const countResult = await pool.query(countQuery, [`%${search}%`]);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        signs: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      });
    } else {
      const countResult = await pool.query('SELECT COUNT(*) FROM dictionary_signs');
      const total = parseInt(countResult.rows[0].count);

      res.json({
        signs: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      });
    }
  } catch (error) {
    console.error('Get dictionary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sign by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM dictionary_signs WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sign not found' });
    }

    res.json({ sign: result.rows[0] });
  } catch (error) {
    console.error('Get sign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search signs by word or phrase
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const searchQuery = `%${req.params.query}%`;
    const result = await pool.query(
      `SELECT * FROM dictionary_signs 
       WHERE word ILIKE $1 OR description ILIKE $1 
       ORDER BY word ASC 
       LIMIT 50`,
      [searchQuery]
    );

    res.json({ signs: result.rows });
  } catch (error) {
    console.error('Search signs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

