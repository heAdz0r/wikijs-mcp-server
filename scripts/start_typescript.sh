#!/bin/bash

# Скрипт запуска TypeScript версии MCP сервера для Wiki.js
# Запускает скомпилированную версию из директории dist/

# Получаем абсолютный путь к директории проекта (на уровень выше от scripts)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Переходим в директорию проекта
cd "$PROJECT_DIR"

# Убить существующий процесс сервера, если он запущен
pkill -f "node dist/server.js" || true

# Загрузить переменные окружения из .env файла
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "Загружены переменные из .env файла"
else
    echo "Файл .env не найден. Рекомендуется создать его на основе example.env"
fi

# Установить значения по умолчанию, если переменные не заданы
export PORT=${PORT:-8000}
export WIKIJS_BASE_URL=${WIKIJS_BASE_URL:-http://localhost:3000}

# Проверить наличие обязательных переменных
if [ -z "$WIKIJS_TOKEN" ]; then
    echo "Ошибка: WIKIJS_TOKEN не задан. Создайте .env файл на основе example.env"
    exit 1
fi

# Проверяем, что TypeScript код собран
if [ ! -f "dist/server.js" ]; then
    echo "TypeScript код не собран. Запускаем сборку..."
    npm run build
fi

# Запуск сервера
echo "Запуск TypeScript версии MCP сервера для Wiki.js на порту $PORT с базовым URL $WIKIJS_BASE_URL"
node dist/server.js > server.log 2>&1 &

# Сохраняем PID
echo $! > server.pid
echo "MCP сервер запущен, PID: $(cat server.pid)"

# Проверка доступности API через 2 секунды
sleep 2
if curl -s http://localhost:$PORT/health > /dev/null; then
  echo "API доступен, сервер работает корректно"
  curl -s http://localhost:$PORT/health
else
  echo "Ошибка: API недоступен"
  cat server.log
fi 