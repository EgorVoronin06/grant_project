# Платформа обучения языку жестов

Интерактивная платформа для обучения языку жестов с использованием искусственного интеллекта и технологий распознавания жестов через камеру.

## Структура проекта

- `frontend/` - SvelteKit фронтенд приложение
- `backend/` - Node.js/Express бэкенд API

## Быстрый старт

### 1. Установка зависимостей

Установите все зависимости для проекта:

```bash
npm run install:all
```

Или установите по отдельности:

```bash
# Корневые зависимости
npm install

# Backend зависимости
cd backend
npm install

# Frontend зависимости
cd ../frontend
npm install
```

### 2. Настройка базы данных

1. Убедитесь, что PostgreSQL запущен
2. Создайте файл `.env` в папке `backend/` на основе `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

3. Настройте переменные окружения в `.env`:
   - `DB_HOST` - хост базы данных (по умолчанию 127.0.0.1)
   - `DB_PORT` - порт базы данных (по умолчанию 5432)
   - `DB_NAME` - имя базы данных (по умолчанию postgres)
   - `DB_USER` - пользователь базы данных (по умолчанию postgres)
   - `DB_PASSWORD` - пароль базы данных (по умолчанию example)
   - `JWT_SECRET` - секретный ключ для JWT токенов
   - `PORT` - порт для бэкенд сервера (по умолчанию 3001)
   - `FRONTEND_URL` - URL фронтенда (по умолчанию http://localhost:5173)

4. Инициализируйте схему базы данных:

```bash
psql -U postgres -d postgres -f backend/src/database/schema.sql
```

Или через psql:

```bash
psql -U postgres -d postgres
\i backend/src/database/schema.sql
```

### 3. Запуск проекта

#### Запуск frontend и backend одновременно:

```bash
npm run dev
```

Это запустит:
- Backend на `http://localhost:3001`
- Frontend на `http://localhost:5173` (или другом порту, если 5173 занят)

#### Запуск по отдельности:

```bash
# Backend
npm run dev:backend
# или
cd backend
npm run dev

# Frontend
npm run dev:frontend
# или
cd frontend
npm run dev
```

## API Endpoints

Backend API доступен по адресу `http://localhost:3001/api`

### Основные эндпоинты:

- **Аутентификация**: `/api/auth/*`
- **Пользователи**: `/api/users/*`
- **Словарь жестов**: `/api/dictionary/*`
- **Курсы**: `/api/courses/*`
- **Уроки**: `/api/lessons/*`
- **Прогресс**: `/api/progress/*`
- **Распознавание жестов**: `/api/recognition/*`
- **Рейтинг**: `/api/leaderboard/*`

Подробная документация API находится в `backend/README.md`

## Технологии

### Frontend
- SvelteKit
- TypeScript
- Tailwind CSS
- TensorFlow.js
- MediaPipe
- ONNX Runtime

### Backend
- Node.js
- Express
- PostgreSQL
- JWT для аутентификации
- bcrypt для хеширования паролей

## Функциональность

- ✅ Регистрация и авторизация пользователей
- ✅ Профили пользователей с настройками
- ✅ Словарь жестов с поиском
- ✅ Курсы и уроки
- ✅ Система прогресса обучения
- ✅ Распознавание жестов через камеру
- ✅ Система достижений
- ✅ Рейтинг и таблица лидеров

## Разработка

### Структура базы данных

База данных включает следующие таблицы:
- `users` - Пользователи
- `dictionary_signs` - Словарь жестов
- `courses` - Курсы
- `lessons` - Уроки
- `user_progress` - Прогресс пользователей
- `achievements` - Достижения
- `user_achievements` - Достижения пользователей
- `recognition_attempts` - Попытки распознавания жестов

## Контакты

Контактное лицо: Бабин Даниил Юрьевич
- Телефон: 8(3467)360-100 (доб. 6092)
- Email: BabinDJ@uriit.ru
- Telegram: recloud13

