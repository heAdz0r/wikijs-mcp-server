#!/bin/bash

# Скрипт для тестирования MCP серверов Wiki.js

# Получаем абсолютный путь к директории проекта (на уровень выше от scripts)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Переходим в директорию проекта
cd "$PROJECT_DIR"

# Загрузить переменные окружения из .env файла
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "Загружены переменные из .env файла"
else
    echo "Файл .env не найден. Рекомендуется создать его на основе example.env"
fi

# Установить значения по умолчанию
export PORT=${PORT:-3200}
export WIKIJS_BASE_URL=${WIKIJS_BASE_URL:-http://localhost:3000}

echo "=== Запуск тестов MCP сервера Wiki.js ==="
echo "Порт: $PORT"
echo "Wiki.js URL: $WIKIJS_BASE_URL"
echo

# Запускаем тесты
echo "Запуск основного теста HTTP сервера..."
node scripts/test_mcp.js

echo
echo "Запуск теста STDIN сервера..."
node scripts/test_mcp_stdin.js 