#!/usr/bin/env node

/**
 * Тестирование MCP сервера для Wiki.js через stdio
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { config as dotenvConfig } from "dotenv";

// Загружаем переменные окружения из .env файла
dotenvConfig();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Запуск MCP сервера (из родительской директории)
const serverPath = path.join(path.dirname(__dirname), "mcp_wikijs_stdin.js");
const serverProcess = spawn("node", [serverPath], {
  stdio: ["pipe", "pipe", "inherit"],
  env: {
    ...process.env,
    WIKIJS_BASE_URL: process.env.WIKIJS_BASE_URL || "http://localhost:3000",
    WIKIJS_TOKEN: process.env.WIKIJS_TOKEN || "your_wikijs_api_token_here",
  },
});

// Обработка ответов от сервера
serverProcess.stdout.setEncoding("utf8");
let responseBuffer = "";

serverProcess.stdout.on("data", (chunk) => {
  responseBuffer += chunk;
  if (responseBuffer.includes("\n")) {
    const lines = responseBuffer.split("\n");
    responseBuffer = lines.pop(); // Оставляем неполную строку в буфере

    for (const line of lines) {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          console.log("\nПолучен ответ:", JSON.stringify(response, null, 2));
        } catch (error) {
          console.error("Ошибка при разборе ответа:", error.message);
          console.error("Исходный текст:", line);
        }
      }
    }
  }
});

// Функция для отправки запроса серверу
function sendRequest(request) {
  console.log(`\nОтправка запроса: ${JSON.stringify(request, null, 2)}`);
  serverProcess.stdin.write(JSON.stringify(request) + "\n");
}

// Ждем немного, чтобы сервер запустился
setTimeout(() => {
  // Запрашиваем список инструментов
  console.log("🔍 Тестирование запроса tools...");
  sendRequest({
    id: "1",
    type: "query",
    query: "tools",
  });

  // Запрашиваем список страниц
  setTimeout(() => {
    console.log("🔍 Тестирование метода list_pages...");
    sendRequest({
      id: "2",
      type: "function_call",
      name: "list_pages",
      parameters: {
        limit: 5,
      },
    });
  }, 2000);

  // Поиск страниц
  setTimeout(() => {
    console.log("🔍 Тестирование метода search_pages...");
    sendRequest({
      id: "3",
      type: "function_call",
      name: "search_pages",
      parameters: {
        query: "test",
        limit: 3,
      },
    });
  }, 4000);
}, 2000);

// Обработка завершения сервера
serverProcess.on("close", (code) => {
  console.log(`MCP сервер завершил работу с кодом ${code}`);
  process.exit(0);
});

// Корректное завершение при прерывании
process.on("SIGINT", () => {
  console.log("Получен сигнал SIGINT, завершаем работу...");
  serverProcess.kill();
  process.exit(0);
});
