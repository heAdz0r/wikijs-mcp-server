#!/bin/bash

# Скрипт для первоначальной настройки проекта Wiki.js MCP Сервер

# Получаем абсолютный путь к директории проекта (на уровень выше от scripts)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Переходим в директорию проекта
cd "$PROJECT_DIR"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Настройка проекта Wiki.js MCP Сервер ===${NC}\n"

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ОШИБКА] Node.js не установлен. Пожалуйста, установите Node.js перед продолжением.${NC}"
    exit 1
fi

# Проверка версии Node.js
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ] Рекомендуется использовать Node.js версии 18 или выше. Текущая версия: $(node -v)${NC}"
fi

echo -e "${GREEN}[ШАГ 1] Установка зависимостей проекта...${NC}"
npm install

# Проверка наличия файла .env
if [ ! -f .env ]; then
    echo -e "${GREEN}[ШАГ 2] Создание файла конфигурации .env...${NC}"
    cp example.env .env
    echo -e "${YELLOW}[ЗАМЕТКА] Создан файл .env. Пожалуйста, отредактируйте его, указав правильные настройки подключения к Wiki.js.${NC}"
else
    echo -e "${GREEN}[ШАГ 2] Файл .env уже существует. Пропускаем...${NC}"
fi

echo -e "${GREEN}[ШАГ 3] Сборка проекта...${NC}"
npm run build

echo -e "\n${GREEN}=== Настройка проекта завершена! ===${NC}"
echo -e "${YELLOW}Чтобы запустить основной HTTP сервер:${NC} ./scripts/start_http.sh"
echo -e "${YELLOW}Чтобы запустить TypeScript версию:${NC} ./scripts/start_typescript.sh"
echo -e "${YELLOW}Для настройки Cursor MCP:${NC} ./scripts/setup_cursor_mcp.sh"
echo -e "\n${YELLOW}Убедитесь, что вы правильно настроили файл .env с параметрами подключения к Wiki.js.${NC}" 