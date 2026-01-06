import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const SALT_ROUNDS = 10;

// Хэширование пароля
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Проверка пароля
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Генерация JWT токена
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      skill_level: user.skill_level
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Верификация токена
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Middleware для проверки аутентификации
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Требуется аутентификация. Токен отсутствует.' 
    });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ 
      success: false,
      error: 'Неверный или просроченный токен' 
    });
  }

  req.user = user;
  next();
}

// Проверка ролей (если понадобится позже)
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не аутентифицирован' 
      });
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Недостаточно прав' 
      });
    }

    next();
  };
}