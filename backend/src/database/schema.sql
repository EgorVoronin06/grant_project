-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    skill_level VARCHAR(50) DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dictionary of signs
CREATE TABLE IF NOT EXISTS dictionary_signs (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    category VARCHAR(100),
    difficulty VARCHAR(50) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100),
    image_url VARCHAR(500),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    video_url VARCHAR(500),
    order_index INTEGER DEFAULT 0,
    duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    score DECIMAL(5,2) DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    completed BOOLEAN DEFAULT FALSE,
    recognition_data JSONB,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(255),
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Recognition attempts
CREATE TABLE IF NOT EXISTS recognition_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    sign_id INTEGER REFERENCES dictionary_signs(id) ON DELETE SET NULL,
    frame_data JSONB NOT NULL,
    predicted_sign VARCHAR(255),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_recognition_attempts_user_id ON recognition_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_dictionary_signs_word ON dictionary_signs(word);

-- Insert default achievements
INSERT INTO achievements (title, description, type, icon, points) VALUES
    ('Первый шаг', 'Завершите свой первый урок', 'first_lesson', '🎯', 10),
    ('Пятерка', 'Завершите 5 уроков', 'five_lessons', '⭐', 25),
    ('Десятка', 'Завершите 10 уроков', 'ten_lessons', '🌟', 50),
    ('Мастер', 'Завершите 25 уроков', 'twenty_five_lessons', '👑', 100),
    ('Отличник', 'Средний балл выше 80', 'high_score', '🏆', 75)
ON CONFLICT (type) DO NOTHING;

