#!/bin/bash

# Скрипт запуска MCP HTTP сервера для Wiki.js
# Основная рабочая версия с поддержкой JSON-RPC и прямых вызовов инструментов

# Получаем абсолютный путь к директории проекта (на уровень выше от scripts)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Переходим в директорию проекта
cd "$PROJECT_DIR"

# Убить существующие процессы MCP сервера, если они запущены
echo "Останавливаем существующие MCP серверы..."
pkill -f "fixed_mcp_http_server.js" || true
pkill -f "mcp_wikijs_stdin.js" || true
pkill -f "mcp_http_server.js" || true

# Ждем завершения процессов
sleep 1

# Загрузить переменные окружения из .env файла
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "Загружены переменные из .env файла"
else
    echo "Файл .env не найден. Рекомендуется создать его на основе example.env"
fi

# Установить значения по умолчанию, если переменные не заданы
export PORT=${PORT:-3200}
export WIKIJS_BASE_URL=${WIKIJS_BASE_URL:-http://localhost:3000}

# Проверить наличие обязательных переменных
if [ -z "$WIKIJS_TOKEN" ]; then
    echo "Ошибка: WIKIJS_TOKEN не задан. Создайте .env файл на основе example.env"
    exit 1
fi

# Запуск исправленного HTTP сервера
echo "Запуск MCP HTTP сервера для Wiki.js на порту $PORT с базовым URL $WIKIJS_BASE_URL"
node lib/fixed_mcp_http_server.js > fixed_server.log 2>&1 &

# Сохраняем PID
echo $! > server.pid
echo "MCP HTTP сервер запущен, PID: $(cat server.pid)"

# Проверка доступности API через 2 секунды
sleep 2
if curl -s http://localhost:$PORT/health > /dev/null; then
  echo "API доступен, сервер работает корректно"
  curl -s http://localhost:$PORT/health
else
  echo "Ошибка: API недоступен"
  cat fixed_server.log
fi 