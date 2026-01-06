# Устранение проблем

## Порт 3001 уже занят (EADDRINUSE)

Если вы видите ошибку `Error: listen EADDRINUSE: address already in use :::3001`, выполните:

### Windows:
```powershell
# Найти процесс, использующий порт
netstat -ano | findstr :3001

# Убить процесс (замените <PID> на номер процесса из предыдущей команды)
taskkill /F /PID <PID>
```

### Или измените порт в backend/.env:
```env
PORT=3002
```

И обновите FRONTEND_URL если нужно:
```env
FRONTEND_URL=http://localhost:5173
```

## Vite не найден

Если вы видите ошибку `"vite" не является внутренней или внешней командой`:

```bash
cd frontend
npm install
```

## Зависимости не установлены

Установите все зависимости:

```bash
npm run install:all
```

Или по отдельности:

```bash
# Корневые
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## База данных не подключена

1. Убедитесь, что PostgreSQL запущен
2. Проверьте настройки в `backend/.env`
3. Проверьте подключение:
```bash
psql -U postgres -d postgres -c "SELECT version();"
```

4. Инициализируйте схему:
```bash
psql -U postgres -d postgres -f backend/src/database/schema.sql
```

## Проблемы с CORS

Если frontend не может подключиться к backend:

1. Проверьте `FRONTEND_URL` в `backend/.env`
2. Убедитесь, что frontend запущен на правильном порту
3. Проверьте, что backend запущен и доступен на `http://localhost:3001/api/health`

