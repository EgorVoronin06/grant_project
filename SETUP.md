# Инструкция по настройке проекта

## Шаг 1: Создайте файл .env для backend

В папке `backend/` создайте файл `.env` со следующим содержимым:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=example

# JWT Secret (измените на свой секретный ключ!)
JWT_SECRET=your-secret-key-change-in-production-please-use-strong-secret
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

## Шаг 2: Настройте базу данных PostgreSQL

1. Убедитесь, что PostgreSQL запущен
2. Выполните SQL скрипт для создания таблиц:

```bash
psql -U postgres -d postgres -f backend/src/database/schema.sql
```

Или через psql консоль:

```bash
psql -U postgres -d postgres
\i backend/src/database/schema.sql
\q
```

## Шаг 3: Запустите проект

```bash
npm run dev
```

Это запустит одновременно frontend и backend.

## Проверка работы

1. Backend должен быть доступен на `http://localhost:3001`
2. Проверьте health endpoint: `http://localhost:3001/api/health`
3. Frontend должен быть доступен на `http://localhost:5173` (или другом порту)

## Устранение проблем

### Ошибка подключения к базе данных
- Убедитесь, что PostgreSQL запущен
- Проверьте настройки в `.env` файле
- Убедитесь, что база данных существует

### Порт уже занят
- Измените `PORT` в `.env` файле backend
- Или измените порт frontend в `vite.config.ts`

### Ошибка при установке зависимостей
- Убедитесь, что у вас установлен Node.js версии 18 или выше
- Попробуйте удалить `node_modules` и `package-lock.json` и установить заново

