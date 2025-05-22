#!/bin/bash

# Скрипт для настройки проектного MCP-сервера Wiki.js в Cursor
# Создает проектную конфигурацию для текущего проекта

# Определение цветов для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Получаем абсолютный путь к директории проекта (на уровень выше от scripts)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Загружаем переменные окружения из .env файла
if [ -f "$SCRIPT_DIR/.env" ]; then
    source "$SCRIPT_DIR/.env"
    echo -e "${GREEN}Загружены переменные из .env файла${NC}"
else
    echo -e "${YELLOW}Файл .env не найден. Используем значения по умолчанию.${NC}"
    echo -e "${YELLOW}Рекомендуется создать .env файл на основе example.env${NC}"
fi

# Устанавливаем значения по умолчанию, если переменные не заданы
WIKIJS_BASE_URL="${WIKIJS_BASE_URL:-http://localhost:3000}"
WIKIJS_TOKEN="${WIKIJS_TOKEN:-your_wikijs_api_token_here}"
PORT="${PORT:-3200}"

# Создаем директорию .cursor в текущем проекте
PROJECT_CURSOR_DIR="$SCRIPT_DIR/.cursor"
if [ ! -d "$PROJECT_CURSOR_DIR" ]; then
    echo -e "${YELLOW}Создание директории $PROJECT_CURSOR_DIR${NC}"
    mkdir -p "$PROJECT_CURSOR_DIR"
fi

# Создаем конфигурацию MCP
MCP_CONFIG_FILE="$PROJECT_CURSOR_DIR/mcp.json"

# Проверяем, существует ли уже файл конфигурации
if [ -f "$MCP_CONFIG_FILE" ]; then
    echo -e "${YELLOW}Найден существующий файл конфигурации MCP.${NC}"
    echo -e "${YELLOW}Создаем резервную копию.${NC}"
    cp "$MCP_CONFIG_FILE" "$MCP_CONFIG_FILE.backup"
    echo -e "${GREEN}Резервная копия создана: $MCP_CONFIG_FILE.backup${NC}"
fi

# Создаем новую конфигурацию
echo -e "${GREEN}Создание проектной конфигурации MCP для Wiki.js...${NC}"

cat > "$MCP_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "wikijs": {
      "transport": "http",
      "url": "http://localhost:$PORT/mcp",
      "events": "http://localhost:$PORT/mcp/events",
      "cwd": "$SCRIPT_DIR",
      "env": {
        "WIKIJS_BASE_URL": "$WIKIJS_BASE_URL",
        "WIKIJS_TOKEN": "$WIKIJS_TOKEN"
      }
    }
  }
}
EOF

# Также создаем копию в репозитории как пример (с плейсхолдерами)
EXAMPLE_MCP_CONFIG="$SCRIPT_DIR/.cursor/mcp.json"
if [ ! -f "$EXAMPLE_MCP_CONFIG" ] || [ "$MCP_CONFIG_FILE" != "$EXAMPLE_MCP_CONFIG" ]; then
cat > "$EXAMPLE_MCP_CONFIG" << EOF
{
  "mcpServers": {
    "wikijs": {
      "transport": "http",
      "url": "http://localhost:3200/mcp",
      "events": "http://localhost:3200/mcp/events",
      "cwd": ".",
      "env": {
        "WIKIJS_BASE_URL": "http://localhost:3000",
        "WIKIJS_TOKEN": "your_wikijs_api_token_here"
      }
    }
  }
}
EOF
echo -e "${GREEN}Пример конфигурации также сохранен в .cursor/mcp.json${NC}"
fi

echo -e "${GREEN}Проектная конфигурация MCP успешно создана: $MCP_CONFIG_FILE${NC}"

if [ "$WIKIJS_TOKEN" = "your_wikijs_api_token_here" ]; then
    echo -e "${YELLOW}ВАЖНО: Настройте переменные окружения в файле .env:${NC}"
    echo -e "${YELLOW}       - WIKIJS_BASE_URL (текущее: $WIKIJS_BASE_URL)${NC}"
    echo -e "${YELLOW}       - WIKIJS_TOKEN (токен API Wiki.js)${NC}"
else
    echo -e "${GREEN}Конфигурация создана с использованием переменных из .env${NC}"
fi

echo -e "${GREEN}Перезапустите Cursor, чтобы изменения вступили в силу.${NC}" 