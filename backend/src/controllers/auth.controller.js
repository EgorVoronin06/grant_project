import pool from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

/**
 * Регистрация нового пользователя
 */
export async function register(req, res) {
  try {
    const { email, password, name, skill_level = 'beginner' } = req.body;

    console.log('📝 Регистрация пользователя:', { email, name });

    // Валидация обязательных полей
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Требуется email, пароль и имя'
      });
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный формат email'
      });
    }

    // Проверка длины пароля
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Пароль должен быть не менее 8 символов'
      });
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Пользователь с таким email уже существует'
      });
    }

    // Хэшируем пароль
    const hashedPassword = await hashPassword(password);

    // Извлекаем дополнительные поля
    const { phone, birth_date, preferences = {} } = req.body;

    // Создаем пользователя в базе данных
    const result = await pool.query(
      `INSERT INTO users (
        email, password, name, phone, birth_date, 
        skill_level, preferences, total_points,
        created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, email, name, phone, birth_date, skill_level, preferences, created_at`,
      [
        email,
        hashedPassword,
        name,
        phone || null,
        birth_date || null,
        skill_level,
        JSON.stringify(preferences)
      ]
    );

    const user = result.rows[0];

    // Создаем начальную активность
    await pool.query(
      `INSERT INTO daily_activity (user_id, activity_date, points_earned) 
       VALUES ($1, CURRENT_DATE, 10)
       ON CONFLICT (user_id, activity_date) DO NOTHING`,
      [user.id]
    ).catch(err => console.error('Activity creation error:', err));

    // Добавляем приветственное уведомление
    await pool.query(
      `INSERT INTO user_notifications (user_id, title, message, type) 
       VALUES ($1, $2, $3, $4)`,
      [
        user.id,
        'Добро пожаловать! 🎉',
        'Вы успешно зарегистрировались на платформе обучения языку жестов. Начните с первого урока!',
        'success'
      ]
    ).catch(err => console.error('Notification creation error:', err));
    
    // Генерируем JWT токен
    const token = generateToken(user);

    console.log('✅ Пользователь зарегистрирован:', user.email);

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          skill_level: user.skill_level,
          total_points: 0,
          level: 1
        },
        token,
        expiresIn: '7d'
      }
    });

  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    
    // Определяем тип ошибки и возвращаем соответствующее сообщение
    let errorMessage = 'Ошибка сервера при регистрации';
    let statusCode = 500;
    
    // Ошибки базы данных
    if (error.code === '23505') { // Unique violation
      errorMessage = 'Пользователь с таким email уже существует';
      statusCode = 409;
    } else if (error.code === '23503') { // Foreign key violation
      errorMessage = 'Ошибка целостности данных';
      statusCode = 400;
    } else if (error.code === '42P01') { // Table doesn't exist
      errorMessage = 'Ошибка базы данных: таблица не найдена. Проверьте миграции БД.';
      statusCode = 500;
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      errorMessage = 'Не удалось подключиться к базе данных. Проверьте настройки подключения.';
      statusCode = 503;
    } else if (error.message) {
      // Используем сообщение из ошибки, если оно есть
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        code: error.code,
        stack: error.stack
      })
    });
  }
}

/**
 * Вход пользователя
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    console.log('🔑 Попытка входа для:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Требуется email и пароль'
      });
    }

    // Ищем пользователя по email
    const result = await pool.query(
      `SELECT id, email, password, name, phone, skill_level, 
              avatar_url, total_points, current_streak, max_streak,
              preferences, created_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Пользователь не найден:', email);
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    const user = result.rows[0];

    // Проверяем пароль
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Неверный пароль для:', email);
      return res.status(401).json({
        success: false,
        error: 'Неверный email или пароль'
      });
    }

    // Обновляем последнюю активность и проверяем streak
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.last_active_date;
    
    let newStreak = user.current_streak || 0;
    if (lastActive) {
      const lastDate = new Date(lastActive);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak = (user.current_streak || 0) + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await pool.query(
      `UPDATE users 
       SET last_active_date = $1, 
           current_streak = $2,
           max_streak = GREATEST(COALESCE(max_streak, 0), $2),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [today, newStreak, user.id]
    ).catch(err => console.error('Streak update error:', err));

    // Генерируем JWT токен
    const token = generateToken(user);

    console.log('✅ Успешный вход:', user.email);

    // Не возвращаем пароль
    delete user.password;

    // Вычисляем уровень
    const level = calculateUserLevel(user.total_points || 0);

    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      data: {
        user: {
          ...user,
          level
        },
        token,
        expiresIn: '7d'
      }
    });

  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера при входе',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Получение профиля текущего пользователя
 */
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    console.log('👤 Запрос профиля для user ID:', userId);

    const result = await pool.query(
      `SELECT 
        id, email, name, phone, birth_date, skill_level,
        avatar_url, total_points, current_streak, max_streak,
        preferences, about, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    const user = result.rows[0];
    user.level = calculateUserLevel(user.total_points || 0);

    // Получаем статистику
    const statsResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT up.lesson_id) as total_lessons,
        COUNT(DISTINCT CASE WHEN up.completed THEN up.lesson_id END) as completed_lessons,
        COUNT(DISTINCT ua.achievement_id) as achievements_count,
        COUNT(DISTINCT ra.id) as recognition_attempts,
        COALESCE(AVG(up.score), 0) as avg_score
       FROM users u
       LEFT JOIN user_progress up ON u.id = up.user_id
       LEFT JOIN user_achievements ua ON u.id = ua.user_id
       LEFT JOIN recognition_attempts ra ON u.id = ra.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId]
    ).catch(() => ({ rows: [{}] }));

    // Получаем последнюю активность
    const activityResult = await pool.query(
      `SELECT 
        activity_date,
        lessons_completed,
        signs_learned,
        practice_time_minutes,
        points_earned
       FROM daily_activity 
       WHERE user_id = $1 
       ORDER BY activity_date DESC 
       LIMIT 7`,
      [userId]
    ).catch(() => ({ rows: [] }));

    // Получаем непрочитанные уведомления
    const notificationsResult = await pool.query(
      `SELECT id, title, message, type, created_at
       FROM user_notifications 
       WHERE user_id = $1 AND is_read = false
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    ).catch(() => ({ rows: [] }));

    res.json({
      success: true,
      data: {
        user,
        stats: statsResult.rows[0] || {},
        weekly_activity: activityResult.rows,
        notifications: notificationsResult.rows,
        level_progress: calculateLevelProgress(user.total_points || 0)
      }
    });

  } catch (error) {
    console.error('❌ Ошибка получения профиля:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера при получении профиля'
    });
  }
}

/**
 * Обновление профиля пользователя
 */
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const {
      name,
      phone,
      birth_date,
      skill_level,
      about,
      preferences
    } = req.body;

    console.log('✏️ Обновление профиля для user ID:', userId);

    // Собираем только те поля, которые предоставлены для обновления
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }

    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex}`);
      values.push(phone);
      paramIndex++;
    }

    if (birth_date !== undefined) {
      updates.push(`birth_date = $${paramIndex}`);
      values.push(birth_date);
      paramIndex++;
    }

    if (skill_level !== undefined) {
      updates.push(`skill_level = $${paramIndex}`);
      values.push(skill_level);
      paramIndex++;
    }

    if (about !== undefined) {
      updates.push(`about = $${paramIndex}`);
      values.push(about);
      paramIndex++;
    }

    if (preferences !== undefined) {
      updates.push(`preferences = $${paramIndex}`);
      values.push(JSON.stringify(preferences));
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Нет данных для обновления'
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, name, phone, birth_date, skill_level, 
                avatar_url, about, preferences, updated_at
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      message: 'Профиль успешно обновлен',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Ошибка обновления профиля:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера при обновлении профиля'
    });
  }
}

/**
 * Выход пользователя (на клиенте просто удаляем токен)
 */
export async function logout(req, res) {
  try {
    // На сервере просто возвращаем успех, клиент удалит токен локально
    res.json({
      success: true,
      message: 'Выход выполнен успешно'
    });
  } catch (error) {
    console.error('❌ Ошибка выхода:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера при выходе'
    });
  }
}

/**
 * Проверка валидности токена
 */
export async function verifyAuth(req, res) {
  try {
    // Если middleware authenticateToken прошло успешно, пользователь уже в req.user
    const user = req.user;
    
    // Получаем свежие данные пользователя из БД
    const result = await pool.query(
      `SELECT id, email, name, skill_level, preferences, created_at, 
              avatar_url, total_points, current_streak
       FROM users WHERE id = $1`,
      [user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    const userData = result.rows[0];
    userData.level = calculateUserLevel(userData.total_points || 0);

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('❌ Ошибка проверки аутентификации:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера при проверке аутентификации'
    });
  }
}

/**
 * Получение прогресса пользователя
 */
export async function getUserProgress(req, res) {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    // Прогресс по курсам
    const coursesResult = await pool.query(
      `SELECT 
        c.id, c.title, c.level, c.image_url,
        COUNT(DISTINCT l.id) as total_lessons,
        COUNT(DISTINCT CASE WHEN up.completed THEN l.id END) as completed_lessons,
        COALESCE(AVG(up.score), 0) as avg_score
       FROM courses c
       JOIN lessons l ON c.id = l.course_id
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       GROUP BY c.id, c.title, c.level, c.image_url
       ORDER BY c.order_index ASC`,
      [userId]
    ).catch(() => ({ rows: [] }));

    // Последние выполненные уроки
    const recentLessonsResult = await pool.query(
      `SELECT 
        up.id, up.lesson_id, up.score, up.completed_at,
        l.title as lesson_title, l.video_url,
        c.title as course_title, c.level as course_level
       FROM user_progress up
       JOIN lessons l ON up.lesson_id = l.id
       JOIN courses c ON l.course_id = c.id
       WHERE up.user_id = $1 AND up.completed = true
       ORDER BY up.completed_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    ).catch(() => ({ rows: [] }));

    // Статистика по дням
    const dailyStatsResult = await pool.query(
      `SELECT 
        activity_date,
        lessons_completed,
        signs_learned,
        practice_time_minutes,
        points_earned
       FROM daily_activity 
       WHERE user_id = $1 
       ORDER BY activity_date DESC 
       LIMIT 30`,
      [userId]
    ).catch(() => ({ rows: [] }));

    res.json({
      success: true,
      data: {
        courses: coursesResult.rows,
        recent_lessons: recentLessonsResult.rows,
        daily_stats: dailyStatsResult.rows,
        total_courses: coursesResult.rows.length,
        total_lessons_completed: recentLessonsResult.rows.length
      }
    });

  } catch (error) {
    console.error('❌ Ошибка получения прогресса:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера при получении прогресса'
    });
  }
}

/**
 * Получение достижений пользователя
 */
export async function getUserAchievements(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        a.id, a.title, a.description, a.icon, a.points, a.type,
        ua.earned_at,
        CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as earned
       FROM achievements a
       LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
       ORDER BY a.points DESC, a.title ASC`,
      [userId]
    ).catch(() => ({ rows: [] }));

    // Группируем по статусу
    const earned = result.rows.filter(r => r.earned);
    const notEarned = result.rows.filter(r => !r.earned);

    res.json({
      success: true,
      data: {
        earned,
        not_earned: notEarned,
        total_achievements: result.rows.length,
        earned_count: earned.length,
        total_points: earned.reduce((sum, a) => sum + (a.points || 0), 0)
      }
    });

  } catch (error) {
    console.error('❌ Ошибка получения достижений:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера при получении достижений'
    });
  }
}

// Вспомогательные функции
function calculateUserLevel(totalPoints) {
  if (totalPoints < 100) return 1;
  if (totalPoints < 300) return 2;
  if (totalPoints < 600) return 3;
  if (totalPoints < 1000) return 4;
  if (totalPoints < 1500) return 5;
  if (totalPoints < 2100) return 6;
  if (totalPoints < 2800) return 7;
  if (totalPoints < 3600) return 8;
  if (totalPoints < 4500) return 9;
  return 10;
}

function calculateLevelProgress(totalPoints) {
  const levels = [
    { level: 1, min: 0, max: 100 },
    { level: 2, min: 100, max: 300 },
    { level: 3, min: 300, max: 600 },
    { level: 4, min: 600, max: 1000 },
    { level: 5, min: 1000, max: 1500 },
    { level: 6, min: 1500, max: 2100 },
    { level: 7, min: 2100, max: 2800 },
    { level: 8, min: 2800, max: 3600 },
    { level: 9, min: 3600, max: 4500 },
    { level: 10, min: 4500, max: Infinity }
  ];

  const currentLevel = calculateUserLevel(totalPoints);
  const levelInfo = levels.find(l => l.level === currentLevel);
  
  if (!levelInfo) return { current: 0, total: 100, percent: 0 };

  const progressInLevel = totalPoints - levelInfo.min;
  const levelRange = levelInfo.max - levelInfo.min;
  const percent = Math.round((progressInLevel / levelRange) * 100);

  return {
    current: progressInLevel,
    total: levelRange,
    percent: Math.min(percent, 100),
    level: currentLevel,
    nextLevel: currentLevel < 10 ? currentLevel + 1 : null
  };
}