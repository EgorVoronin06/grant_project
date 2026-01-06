# Backend API для платформы обучения языку жестов

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` на основе `.env.example` и настройте переменные окружения:
```bash
cp .env.example .env
```

3. Убедитесь, что PostgreSQL запущен и создайте базу данных (если нужно)

4. Инициализируйте схему базы данных:
```bash
psql -U postgres -d postgres -f src/database/schema.sql
```

## Запуск

### Режим разработки (с автоперезагрузкой):
```bash
npm run dev
```

### Продакшн режим:
```bash
npm start
```

Сервер запустится на порту, указанном в переменной окружения `PORT` (по умолчанию 3001).

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получить текущего пользователя

### Пользователи
- `GET /api/users/profile` - Получить профиль пользователя
- `PUT /api/users/profile` - Обновить профиль
- `GET /api/users/stats` - Получить статистику пользователя

### Словарь жестов
- `GET /api/dictionary` - Получить все жесты (с пагинацией и поиском)
- `GET /api/dictionary/:id` - Получить жест по ID
- `GET /api/dictionary/search/:query` - Поиск жестов

### Курсы
- `GET /api/courses` - Получить все курсы
- `GET /api/courses/:id` - Получить курс по ID

### Уроки
- `GET /api/lessons` - Получить все уроки
- `GET /api/lessons/:id` - Получить урок по ID

### Прогресс
- `POST /api/progress` - Сохранить прогресс урока
- `GET /api/progress` - Получить весь прогресс пользователя
- `GET /api/progress/lesson/:lessonId` - Получить прогресс по уроку
- `GET /api/progress/achievements` - Получить достижения пользователя

### Распознавание жестов
- `POST /api/recognition/attempt` - Сохранить попытку распознавания
- `POST /api/recognition/feedback` - Получить обратную связь по жесту
- `GET /api/recognition/history` - Получить историю распознаваний

### Рейтинг
- `GET /api/leaderboard` - Получить таблицу лидеров

## Структура базы данных

База данных включает следующие таблицы:
- `users` - Пользователи
- `dictionary_signs` - Словарь жестов
- `courses` - Курсы
- `lessons` - Уроки
- `user_progress` - Прогресс пользователей
- `achievements` - Достижения
- `user_achievements` - Достижения пользователей
- `recognition_attempts` - Попытки распознавания жестов

