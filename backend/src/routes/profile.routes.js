import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getProfile, updateProfile, getUserProgress, getUserAchievements } from '../controllers/auth.controller.js';
import pool from '../config/database.js';

const router = express.Router();

// Настройка multer для загрузки файлов (в памяти)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Только изображения (jpeg, jpg, png, gif, webp) разрешены'));
  }
});

// Все маршруты требуют аутентификации
router.use(authenticateToken);

// Получить полный профиль
router.get('/', getProfile);

// Обновить профиль
router.put('/', updateProfile);

// Загрузить аватар (упрощенная версия - сохраняем в базе как base64 или URL)
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Файл не загружен'
      });
    }

    // В продакшене здесь должна быть загрузка в Cloudinary или S3
    // Для разработки сохраняем как base64 или просто возвращаем placeholder
    const avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Или можно сохранить локально и вернуть путь
    // Для простоты используем placeholder
    const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.name || 'User')}&size=200&background=0077FF&color=fff`;

    // Обновляем аватар пользователя
    await pool.query(
      'UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [placeholderUrl, userId]
    );

    res.json({
      success: true,
      message: 'Аватар успешно загружен',
      data: {
        avatar_url: placeholderUrl
      }
    });

  } catch (error) {
    console.error('❌ Ошибка загрузки аватара:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка загрузки аватара'
    });
  }
});

// Получить прогресс пользователя
router.get('/progress', getUserProgress);

// Получить достижения
router.get('/achievements', getUserAchievements);

// Получить активность за период
router.get('/activity', async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'week' } = req.query;
    
    let dateFilter = '';
    switch (period) {
      case 'week':
        dateFilter = "AND activity_date >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "AND activity_date >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      case 'year':
        dateFilter = "AND activity_date >= CURRENT_DATE - INTERVAL '365 days'";
        break;
    }
    
    const result = await pool.query(
      `SELECT 
        activity_date,
        SUM(lessons_completed) as lessons_completed,
        SUM(signs_learned) as signs_learned,
        SUM(practice_time_minutes) as practice_time,
        SUM(points_earned) as points_earned
       FROM daily_activity 
       WHERE user_id = $1 ${dateFilter}
       GROUP BY activity_date
       ORDER BY activity_date`,
      [userId]
    );
    
    res.json({
      success: true,
      data: result.rows,
      period
    });
    
  } catch (error) {
    console.error('Activity error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Пометить уведомления как прочитанные
router.post('/notifications/read', async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationIds } = req.body;
    
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ success: false, error: 'Invalid notification IDs' });
    }
    
    await pool.query(
      `UPDATE user_notifications 
       SET is_read = true 
       WHERE user_id = $1 AND id = ANY($2)`,
      [userId, notificationIds]
    );
    
    res.json({ success: true, message: 'Notifications marked as read' });
    
  } catch (error) {
    console.error('Mark notifications error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

