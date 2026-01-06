import { createServer } from 'http';

/**
 * Проверяет, свободен ли порт
 * @param {number} port - Порт для проверки
 * @returns {Promise<boolean>} - true если порт свободен, false если занят
 */
export function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

