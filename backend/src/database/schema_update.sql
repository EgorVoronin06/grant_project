-- Расширение таблицы users с новыми полями
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE;

-- Таблица для загрузок пользователя (аватары)
CREATE TABLE IF NOT EXISTS user_uploads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для отслеживания ежедневной активности
CREATE TABLE IF NOT EXISTS daily_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    lessons_completed INTEGER DEFAULT 0,
    signs_learned INTEGER DEFAULT 0,
    practice_time_minutes INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    UNIQUE(user_id, activity_date)
);

-- Таблица для уведомлений пользователя
CREATE TABLE IF NOT EXISTS user_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read ON user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_uploads_user_id ON user_uploads(user_id);

-- Функция для расчета уровня пользователя
CREATE OR REPLACE FUNCTION calculate_user_level(total_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN CASE
        WHEN total_points < 100 THEN 1
        WHEN total_points < 300 THEN 2
        WHEN total_points < 600 THEN 3
        WHEN total_points < 1000 THEN 4
        WHEN total_points < 1500 THEN 5
        WHEN total_points < 2100 THEN 6
        WHEN total_points < 2800 THEN 7
        WHEN total_points < 3600 THEN 8
        WHEN total_points < 4500 THEN 9
        ELSE 10
    END;
END;
$$ LANGUAGE plpgsql;

