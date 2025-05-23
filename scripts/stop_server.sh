#!/bin/bash

# Скрипт остановки MCP серверов для Wiki.js
# Останавливает все запущенные процессы MCP сервера

# Получаем абсолютный путь к директории проекта (на уровень выше от scripts)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Переходим в директорию проекта
cd "$PROJECT_DIR"

echo "🛑 Останавливаем MCP серверы Wiki.js..."

# Остановка по PID файлу если он существует
if [ -f server.pid ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "Останавливаем процесс с PID: $PID"
        kill $PID
        sleep 2
        # Принудительная остановка если процесс все еще запущен
        if ps -p $PID > /dev/null 2>&1; then
            echo "Принудительная остановка процесса $PID"
            kill -9 $PID
        fi
    else
        echo "Процесс с PID $PID уже не запущен"
    fi
    rm -f server.pid
    echo "Файл server.pid удален"
fi

# Остановка всех процессов MCP сервера по имени
echo "Останавливаем все процессы MCP сервера..."
pkill -f "fixed_mcp_http_server.js" && echo "✅ Остановлен fixed_mcp_http_server.js" || echo "ℹ️ fixed_mcp_http_server.js не запущен"
pkill -f "mcp_wikijs_stdin.js" && echo "✅ Остановлен mcp_wikijs_stdin.js" || echo "ℹ️ mcp_wikijs_stdin.js не запущен"
pkill -f "mcp_http_server.js" && echo "✅ Остановлен mcp_http_server.js" || echo "ℹ️ mcp_http_server.js не запущен"

# Ждем завершения процессов
sleep 1

# Проверяем, остались ли запущенные процессы
RUNNING_PROCESSES=$(ps aux | grep -E "(fixed_mcp_http_server|mcp_wikijs_stdin|mcp_http_server)" | grep -v grep | wc -l)

if [ $RUNNING_PROCESSES -eq 0 ]; then
    echo "✅ Все MCP серверы успешно остановлены"
else
    echo "⚠️ Обнаружены все еще запущенные процессы MCP:"
    ps aux | grep -E "(fixed_mcp_http_server|mcp_wikijs_stdin|mcp_http_server)" | grep -v grep
    echo ""
    echo "Для принудительной остановки запустите:"
    echo "pkill -9 -f 'mcp'"
fi

# Удаляем лог-файлы если они существуют
if [ -f fixed_server.log ]; then
    rm -f fixed_server.log
    echo "🗑️ Удален файл логов fixed_server.log"
fi

echo "🏁 Остановка завершена" 