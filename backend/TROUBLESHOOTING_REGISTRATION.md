# Решение проблем с регистрацией

## Ошибка "Ошибка сервера при регистрации"

### 1. Проверка подключения к базе данных

**Симптомы:**
- Ошибка "Не удалось подключиться к базе данных"
- Ошибка "ECONNREFUSED"

**Решение:**
1. Убедитесь, что PostgreSQL запущен:
   ```bash
   # Windows (через службы)
   services.msc
   # Найдите PostgreSQL и убедитесь, что служба запущена
   ```

2. Проверьте настройки в `.env` файле:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database_name
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

3. Проверьте подключение вручную:
   ```bash
   psql -U postgres -d your_database_name
   ```

### 2. Проблемы с миграцией базы данных

**Симптомы:**
- Ошибка "таблица не найдена"
- Ошибка "column does not exist"

**Решение:**
1. Примените миграцию:
   ```bash
   psql -U postgres -d your_database_name -f src/database/schema_update.sql
   ```

2. Проверьте, что все таблицы созданы:
   ```sql
   \dt
   SELECT column_name FROM information_schema.columns WHERE table_name = 'users';
   ```

### 3. Проблемы с бэкенд сервером

**Симптомы:**
- Ошибка "Не удалось подключиться к серверу"
- Ошибка "Network error"

**Решение:**
1. Убедитесь, что бэкенд запущен:
   ```bash
   cd backend
   npm run dev
   ```

2. Проверьте, что порт 3001 свободен:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   ```

3. Проверьте URL в запросе (должен быть `http://localhost:3001`)

### 4. Ошибки валидации

**Симптомы:**
- "Пользователь с таким email уже существует"
- "Пароль должен быть не менее 8 символов"

**Решение:**
- Используйте другой email
- Убедитесь, что пароль содержит минимум 8 символов
- Проверьте формат email

### 5. Проверка логов

**На бэкенде:**
Смотрите консоль, где запущен `npm run dev:backend`. Там будут детальные ошибки:
- `❌ Ошибка регистрации:` - показывает полную ошибку
- `❌ Unexpected error on idle client` - ошибка подключения к БД

**На фронтенде:**
Откройте консоль браузера (F12) и проверьте:
- Ошибки в Network tab
- Ошибки в Console tab

### 6. Частые проблемы и решения

#### Проблема: "Cannot find module 'bcrypt'"
**Решение:** Используется `bcryptjs`, убедитесь что он установлен:
```bash
cd backend
npm install bcryptjs
```

#### Проблема: "JWT_SECRET is not defined"
**Решение:** Добавьте в `.env`:
```env
JWT_SECRET=your-secret-key-change-in-production
```

#### Проблема: "relation 'users' does not exist"
**Решение:** Примените базовую схему:
```bash
psql -U postgres -d your_database_name -f src/database/schema.sql
psql -U postgres -d your_database_name -f src/database/schema_update.sql
```

### 7. Тестирование регистрации вручную

Используйте curl для проверки API:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }'
```

### 8. Проверка окружения

Убедитесь, что все переменные окружения установлены:
```bash
# В backend/.env должны быть:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

## Получение детальной информации об ошибке

В режиме разработки (`NODE_ENV=development`) бэкенд возвращает:
- Детальное сообщение об ошибке
- Код ошибки БД (если есть)
- Stack trace

Проверьте ответ сервера в Network tab браузера для получения полной информации.

