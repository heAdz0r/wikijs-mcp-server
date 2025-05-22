# 🚀 Быстрый старт Wiki.js MCP Server

## За 5 минут до полной интеграции с Cursor

### 1. Установка (2 минуты)

```bash
git clone https://github.com/heAdz0r/wikijs-mcp-server.git
cd wikijs-mcp-server
npm run setup
```

### 2. Конфигурация (2 минуты)

**Отредактируйте файл `.env`:**

```bash
nano .env
```

**Замените плейсхолдеры на реальные значения:**

```env
PORT=3200
WIKIJS_BASE_URL=http://your-wiki.example.com
WIKIJS_TOKEN=your_real_wiki_js_api_token
```

**Отредактируйте файл `.cursor/mcp.json`:**

```bash
nano .cursor/mcp.json
```

**Замените токен на реальный:**

```json
{
  "mcpServers": {
    "wikijs": {
      "transport": "http",
      "url": "http://localhost:3200/mcp",
      "events": "http://localhost:3200/mcp/events",
      "cwd": ".",
      "env": {
        "WIKIJS_BASE_URL": "http://your-wiki.example.com",
        "WIKIJS_TOKEN": "your_real_wiki_js_api_token"
      }
    }
  }
}
```

### 3. Запуск и тестирование (1 минута)

```bash
# Запуск HTTP сервера
npm start

# В другом терминале - тест
npm test
```

### 4. Интеграция с Cursor

1. **Перезапустите Cursor**
2. **Проверьте доступность инструментов** - в Cursor должны появиться:
   - `mcp_wikijs_list_pages()`
   - `mcp_wikijs_search_pages()`
   - `mcp_wikijs_get_page()`
   - И другие...

### 5. Первое использование

**В чате Cursor попробуйте:**

```
Покажи мне список страниц из Wiki.js
```

```
Найди все страницы, связанные с "документация"
```

```
Создай новую страницу "Тестовая страница" с содержимым "Это тест"
```

## ⚡ Если что-то не работает

### Проблема: Cursor не видит инструменты

**Решение:**

1. Убедитесь, что HTTP сервер запущен (`npm start`)
2. Проверьте `.cursor/mcp.json` - токен должен быть реальным
3. Перезапустите Cursor

### Проблема: Ошибки подключения к Wiki.js

**Решение:**

1. Проверьте `WIKIJS_BASE_URL` в `.env`
2. Убедитесь, что API токен действителен
3. Проверьте доступность Wiki.js

### Проблема: Сервер не запускается

**Решение:**

```bash
# Проверьте версию Node.js (должна быть ≥18)
node --version

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Поддержка

- 📖 [Полная документация](./README.md)
- 🐛 [Сообщить о проблеме](https://github.com/heAdz0r/wikijs-mcp-server/issues)
- 💬 [Обсуждения](https://github.com/heAdz0r/wikijs-mcp-server/discussions)

---

**🎉 Готово! Теперь у вас есть полная интеграция Wiki.js с Cursor через MCP!**
