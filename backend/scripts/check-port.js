import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Проверяет и освобождает порт на Windows
 */
async function checkAndFreePort(port) {
  try {
    // Проверяем, занят ли порт
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    
    if (!stdout.trim()) {
      console.log(`✅ Port ${port} is free`);
      return true;
    }

    // Извлекаем PID из вывода
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    for (const line of lines) {
      const match = line.match(/\s+(\d+)\s*$/);
      if (match) {
        const pid = match[1];
        // Игнорируем системные процессы
        if (pid && !['0', '4'].includes(pid)) {
          pids.add(pid);
        }
      }
    }

    if (pids.size === 0) {
      console.log(`✅ Port ${port} is free`);
      return true;
    }

    console.log(`⚠️  Port ${port} is in use by process(es): ${Array.from(pids).join(', ')}`);
    console.log(`🔄 Attempting to free port ${port}...`);

    // Пытаемся завершить процессы
    for (const pid of pids) {
      try {
        await execAsync(`taskkill /F /PID ${pid}`);
        console.log(`   ✓ Process ${pid} terminated`);
      } catch (error) {
        console.log(`   ✗ Failed to terminate process ${pid}: ${error.message}`);
      }
    }

    // Ждем немного
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Проверяем снова
    const { stdout: stdout2 } = await execAsync(`netstat -ano | findstr :${port}`);
    if (!stdout2.trim()) {
      console.log(`✅ Port ${port} is now free`);
      return true;
    }

    console.log(`❌ Port ${port} is still in use. Please free it manually.`);
    return false;
  } catch (error) {
    // Если команда не нашла порт, значит он свободен
    if (error.code === 1 || error.message.includes('findstr')) {
      console.log(`✅ Port ${port} is free`);
      return true;
    }
    throw error;
  }
}

// Запускаем проверку
const port = process.env.PORT || 3001;
checkAndFreePort(port)
  .then(free => {
    process.exit(free ? 0 : 1);
  })
  .catch(error => {
    console.error('Error checking port:', error);
    process.exit(1);
  });

