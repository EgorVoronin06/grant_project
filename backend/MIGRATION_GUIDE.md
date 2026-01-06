# Руководство по применению миграции базы данных

## Шаги для обновления схемы БД

1. **Подключитесь к вашей базе данных PostgreSQL**

2. **Примените миграцию schema_update.sql:**

```bash
psql -U postgres -d your_database_name -f src/database/schema_update.sql
```

Или через psql интерактивно:
```sql
\i src/database/schema_update.sql
```

3. **Проверьте, что все таблицы созданы:**

```sql
-- Проверка новых полей в users
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('avatar_url', 'phone', 'birth_date', 'about', 'total_points', 'current_streak', 'max_streak', 'last_active_date');

-- Проверка новых таблиц
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_uploads', 'daily_activity', 'user_notifications');
```

## Что добавляет миграция:

### Новые поля в таблице `users`:
- `avatar_url` - URL аватара пользователя
- `phone` - телефон пользователя
- `birth_date` - дата рождения
- `about` - информация о пользователе
- `total_points` - общее количество очков
- `current_streak` - текущая серия дней активности
- `max_streak` - максимальная серия дней
- `last_active_date` - дата последней активности

### Новые таблицы:
- `user_uploads` - загрузки пользователя (аватары)
- `daily_activity` - ежедневная активность пользователя
- `user_notifications` - уведомления пользователя

### Функции:
- `calculate_user_level(total_points)` - вычисляет уровень пользователя на основе очков

## Важно:

- Миграция использует `IF NOT EXISTS`, поэтому безопасна для повторного запуска
- Все новые поля имеют значения по умолчанию
- Индексы созданы для оптимизации производительности

