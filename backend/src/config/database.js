import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'example',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  // Не завершаем процесс сразу, даем возможность обработать ошибку
  if (err.code === 'ECONNREFUSED') {
    console.error('❌ Не удалось подключиться к базе данных PostgreSQL');
    console.error('   Проверьте:');
    console.error('   1. Запущен ли PostgreSQL сервер');
    console.error('   2. Правильность настроек в .env файле');
    console.error('   3. Доступность хоста и порта');
  }
});

export default pool;

