# Wiki.js MCP Server

![MCP](https://img.shields.io/badge/MCP-Compatible-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-%3E%3D18.0.0-brightgreen)

Model Context Protocol (MCP) сервер для интеграции с Wiki.js через GraphQL API.

## 📖 Описание

Этот проект предоставляет MCP сервер для взаимодействия с Wiki.js через GraphQL API. MCP (Model Context Protocol) - это открытый протокол, разработанный Anthropic, который позволяет AI-моделям безопасно взаимодействовать с внешними сервисами и инструментами.

Сервер предоставляет унифицированный интерфейс для работы с Wiki.js, который может использоваться различными AI-агентами и инструментами, поддерживающими MCP.

## ✨ Возможности

### 📄 Управление страницами

- Получение страниц Wiki.js по ID
- Получение содержимого страниц
- Получение списка страниц с сортировкой
- Умный поиск страниц (по содержимому, названиям и метаданным)
- Создание новых страниц
- Обновление существующих страниц
- Удаление страниц

### 👥 Управление пользователями

- Получение списка пользователей
- Поиск пользователей
- Создание новых пользователей
- Обновление информации о пользователях

### 🔧 Управление группами

- Получение списка групп пользователей
- Управление членством в группах

### 🌐 Транспорты

- **STDIO**: для интеграции с редакторами (Cursor, VS Code)
- **HTTP**: для веб-интеграций и API доступа

## 🚀 Быстрый старт

> **⚡ Хотите начать прямо сейчас?** См. [Руководство за 5 минут](./QUICK_START.md)

### Установка

1. **Клонируйте репозиторий:**

```bash
git clone https://github.com/heAdz0r/wikijs-mcp-server.git
cd wikijs-mcp-server
```

2. **Запустите автоматическую настройку:**

```bash
npm run setup
```

Этот скрипт автоматически:

- Установит зависимости
- Создаст файл `.env` на основе `example.env`
- Соберет TypeScript код

### Конфигурация

3. **Отредактируйте файл `.env`** и укажите настройки вашего Wiki.js:

```env
# Порт для HTTP MCP сервера
PORT=3200

# Базовый URL для Wiki.js (без /graphql)
WIKIJS_BASE_URL=http://localhost:3000

# API-токен Wiki.js
WIKIJS_TOKEN=your_wikijs_api_token_here
```

4. **Отредактируйте файл `.cursor/mcp.json`** и замените `your_wikijs_api_token_here` на ваш реальный токен

> **Как получить API токен Wiki.js:**
>
> 1. Войдите в админ панель Wiki.js
> 2. Перейдите в раздел "API"
> 3. Создайте новый API ключ с необходимыми правами
> 4. Скопируйте токен в `.env` И в `.cursor/mcp.json`

## 📦 Запуск

### HTTP сервер (рекомендуется)

```bash
# Основной HTTP сервер с поддержкой Cursor MCP
npm start
# или
npm run start:http
```

### TypeScript версия

```bash
npm run start:typescript
```

### STDIO режим (для прямой интеграции с редакторами)

```bash
npm run server:stdio
```

### Режим разработки

```bash
npm run dev
```

### Тестирование

```bash
npm test
```

## 🔌 Интеграция с редакторами

### Cursor IDE

> **⚠️ ВАЖНО:** Без файла `.cursor/mcp.json` интеграция с Cursor работать НЕ БУДЕТ!

#### Быстрая настройка

1. **Запустите HTTP сервер:**

```bash
npm start
```

2. **Автоматическая настройка конфигурации:**

```bash
npm run setup:cursor
```

3. **Отредактируйте `.cursor/mcp.json`** и укажите ваш реальный токен:

```json
{
  "mcpServers": {
    "wikijs": {
      "transport": "http",
      "url": "http://localhost:3200/mcp",
      "events": "http://localhost:3200/mcp/events",
      "cwd": ".",
      "env": {
        "WIKIJS_BASE_URL": "http://localhost:3000",
        "WIKIJS_TOKEN": "your_real_wiki_js_token_here"
      }
    }
  }
}
```

#### Критические параметры

- **`transport: "http"`** - обязательно HTTP транспорт
- **`url: "http://localhost:3200/mcp"`** - точный URL для JSON-RPC
- **`events: "http://localhost:3200/mcp/events"`** - URL для Server-Sent Events
- **`WIKIJS_TOKEN`** - реальный API токен Wiki.js (не плейсхолдер!)

#### Проверка работы

После настройки в Cursor должны появиться инструменты с префиксом `mcp_wikijs_*`:

- `mcp_wikijs_list_pages()`
- `mcp_wikijs_search_pages()`
- `mcp_wikijs_get_page()`
- И другие...

### VS Code (с расширением MCP)

Добавьте в настройки VS Code:

```json
{
  "mcp.servers": {
    "wikijs": {
      "command": "node",
      "args": ["mcp_wikijs_stdin.js"],
      "cwd": "/path/to/wikijs-mcp"
    }
  }
}
```

## 🛠 Разработка

### Структура проекта

```
wikijs-mcp-server/
├── src/                    # Исходный код TypeScript
│   ├── server.ts          # HTTP сервер
│   ├── tools.ts           # Определения инструментов
│   ├── api.ts             # API клиент Wiki.js
│   ├── types.ts           # Типы данных
│   └── schemas.ts         # Схемы валидации Zod
├── scripts/               # Скрипты управления
│   ├── setup.sh          # Первоначальная настройка
│   ├── start_http.sh     # Запуск HTTP сервера
│   ├── start_typescript.sh # Запуск TypeScript версии
│   ├── setup_cursor_mcp.sh # Настройка Cursor
│   ├── test.sh           # Запуск тестов
│   ├── test_mcp.js       # Тест HTTP сервера
│   ├── test_mcp_stdin.js # Тест STDIN сервера
│   └── README.md         # Документация скриптов
├── .cursor/               # Конфигурация Cursor MCP
│   └── mcp.json          # Файл конфигурации MCP (КРИТИЧЕСКИ ВАЖЕН!)
├── dist/                  # Скомпилированный TypeScript код
├── *.js                   # Основные JS файлы
├── example.env            # Пример конфигурации окружения
├── package.json           # Метаданные проекта
└── README.md             # Основная документация
```

> **🚨 КРИТИЧЕСКИ ВАЖНО:** Файл `.cursor/mcp.json` обязателен для работы с Cursor!

### Доступные скрипты

#### Настройка и сборка

- `npm run setup` - Первоначальная настройка проекта
- `npm run build` - Сборка TypeScript проекта
- `npm run setup:cursor` - Настройка интеграции с Cursor

#### Запуск серверов

- `npm start` / `npm run start:http` - HTTP MCP сервер (порт 3200)
- `npm run start:typescript` - TypeScript версия сервера (порт 8000)
- `npm run server:stdio` - STDIO версия для прямой интеграции

#### Разработка и тестирование

- `npm run dev` - Режим разработки с hot reload
- `npm run demo` - Демонстрация возможностей
- `npm test` - Запуск тестов
- `npm run client` - Запуск демо-клиента
- `npm run http-client` - Запуск HTTP клиента

### API Endpoints (HTTP режим)

- `GET /tools` - Список доступных инструментов
- `GET /health` - Проверка состояния сервера
- `POST /mcp` - MCP JSON-RPC endpoint

### Примеры использования

```javascript
// Получение списка страниц
{
  "method": "list_pages",
  "params": {
    "limit": 10,
    "orderBy": "TITLE"
  }
}

// Создание новой страницы
{
  "method": "create_page",
  "params": {
    "title": "Новая страница",
    "content": "# Заголовок\n\nСодержимое...",
    "path": "folder/new-page"
  }
}
```

## 🐛 Решение проблем

### Проблемы с подключением

1. Убедитесь, что Wiki.js запущен и доступен
2. Проверьте правильность WIKIJS_BASE_URL
3. Убедитесь, что API токен действителен

### Проблемы с MCP

1. Проверьте версию Node.js (требуется >=18.0.0)
2. Убедитесь, что все зависимости установлены
3. Проверьте логи сервера на наличие ошибок

## 📚 Документация

- [Документация скриптов](./scripts/README.md) - описание всех скриптов управления
- [История изменений](./CHANGELOG.md) - журнал релизов и обновлений
- [Лицензия](./LICENSE) - условия использования проекта

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Загрузите в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для подробностей.

## 🔗 Полезные ссылки

- [Wiki.js](https://js.wiki/) - Официальный сайт Wiki.js
- [Model Context Protocol](https://spec.modelcontextprotocol.io/) - Спецификация MCP
- [Anthropic](https://www.anthropic.com/) - Разработчик протокола MCP
- [GraphQL](https://graphql.org/) - Язык запросов для API

## ⭐ Поддержка

Если этот проект помог вам, поставьте ⭐ на GitHub!

Есть вопросы? Создайте [Issue](https://github.com/heAdz0r/wikijs-mcp-server/issues) или обратитесь к документации.

## 🆕 Новая функциональность: Автоматические URL

### Этапы поиска

Поиск работает в 4 этапа:

1. **GraphQL API поиск** - быстрый поиск по индексированному содержимому
2. **Поиск по метаданным** - поиск в названиях, путях и описаниях страниц
3. **HTTP поиск по содержимому** - глубокий поиск в содержимом страниц через HTTP
4. **Принудительная проверка** - резервный поиск на известных страницах

### Примеры использования

#### Поиск по содержимому

```json
{
  "method": "search_pages",
  "params": {
    "query": "ЗЕЛЕБОБА",
    "limit": 5
  }
}
```

**Результат:**

```json
[
  {
    "id": 103,
    "path": "test/test-page",
    "title": "Тестовая страница",
    "description": "Тестовая страница для демонстрации возможностей Wiki.js API",
    "url": "http://localhost:8080/ru/test/test-page"
  }
]
```

#### Поиск по названию

```json
{
  "method": "search_pages",
  "params": {
    "query": "find me",
    "limit": 3
  }
}
```

**Результат:**

```json
[
  {
    "id": 108,
    "path": "test/test-gemini-mcp",
    "title": "Test Gemini MCP Page (find me)",
    "url": "http://localhost:8080/ru/test/test-gemini-mcp"
  }
]
```

### Преимущества нового поиска

- ✅ **Найдет страницы даже при ограниченных правах API** - использует HTTP fallback
- ✅ **Многоуровневый поиск** - комбинирует несколько стратегий
- ✅ **Поиск по содержимому** - находит текст внутри страниц
- ✅ **Поиск по метаданным** - названия, пути, описания
- ✅ **Резервные методы** - гарантированный результат для известных страниц
- ✅ **Корректные URL** - все результаты содержат готовые ссылки

### Технические детали

#### Обработка HTML содержимого

Система автоматически извлекает текст из HTML с помощью:

- Поиска в блоке `<template slot="contents">`
- Очистки HTML-тегов и entities
- Fallback на полное содержимое страницы

При ограниченных правах GraphQL API система:

- Переключается на HTTP-метод получения содержимого
- Использует прямые запросы к HTML-страницам
- Сохраняет все метаданные страниц
