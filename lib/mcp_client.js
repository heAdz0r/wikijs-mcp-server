#!/usr/bin/env node

/**
 * MCP-клиент для работы с Wiki.js MCP-сервером
 * Демонстрирует использование MCP в режиме клиента
 */

import { spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";
import readline from "readline";
import { config as dotenvConfig } from "dotenv";

// Загружаем переменные окружения из .env файла
dotenvConfig();

// Настройки
const SERVER_COMMAND = "node";
const SERVER_ARGS = ["lib/mcp_wikijs_stdin.js"];
const SERVER_ENV = {
  WIKIJS_BASE_URL: process.env.WIKIJS_BASE_URL || "http://localhost:3000",
  WIKIJS_TOKEN: process.env.WIKIJS_TOKEN || "",
};

// Хранилище для обработчиков ответов
const responseHandlers = new Map();
let tools = [];

console.log("Запуск MCP клиента для Wiki.js...");

// Запуск MCP сервера как дочернего процесса
const serverProcess = spawn(SERVER_COMMAND, SERVER_ARGS, {
  env: { ...process.env, ...SERVER_ENV },
});

// Настройка обработки ошибок
serverProcess.on("error", (err) => {
  console.error(`Ошибка при запуске MCP сервера: ${err.message}`);
  process.exit(1);
});

// Обработка вывода ошибок сервера
serverProcess.stderr.on("data", (data) => {
  console.error(`[MCP Сервер]: ${data.toString().trim()}`);
});

// Буфер для ответов сервера
let responseBuffer = "";

// Обработка ответов сервера
serverProcess.stdout.on("data", (data) => {
  responseBuffer += data.toString();

  // Обработка полных строк JSON
  if (responseBuffer.includes("\n")) {
    const lines = responseBuffer.split("\n");
    responseBuffer = lines.pop() || ""; // Оставляем неполную строку в буфере

    for (const line of lines) {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          processResponse(response);
        } catch (error) {
          console.error(`Ошибка парсинга ответа: ${error.message}`);
        }
      }
    }
  }
});

// Обработка ответов
function processResponse(response) {
  const { id, type, body } = response;

  if (responseHandlers.has(id)) {
    const handler = responseHandlers.get(id);
    responseHandlers.delete(id);
    handler(type, body);
  } else {
    console.log(`Получен неожиданный ответ: ${JSON.stringify(response)}`);
  }
}

// Функция для отправки запросов к MCP серверу
function sendRequest(type, params) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const request = { id, type, ...params };

    // Регистрируем обработчик для ответа
    responseHandlers.set(id, (responseType, responseBody) => {
      if (responseType === "error") {
        reject(new Error(responseBody.message));
      } else {
        resolve(responseBody);
      }
    });

    // Отправляем запрос
    serverProcess.stdin.write(JSON.stringify(request) + "\n");
  });
}

// Загрузка доступных инструментов
async function loadTools() {
  try {
    const response = await sendRequest("query", { query: "tools" });
    tools = response.tools;
    console.log(`Загружено ${tools.length} инструментов:`);
    tools.forEach((tool) => {
      console.log(` - ${tool.function.name}: ${tool.function.description}`);
    });
    return tools;
  } catch (error) {
    console.error(`Ошибка при загрузке инструментов: ${error.message}`);
    throw error;
  }
}

// Функция для вызова инструмента
async function callTool(name, parameters) {
  try {
    console.log(`Вызов инструмента '${name}' с параметрами:`, parameters);
    const result = await sendRequest("function_call", { name, parameters });
    return result;
  } catch (error) {
    console.error(`Ошибка при вызове инструмента ${name}: ${error.message}`);
    throw error;
  }
}

// Интерактивное меню для демонстрации возможностей
async function showInteractiveMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
  }

  while (true) {
    console.log("\n--- Меню MCP клиента Wiki.js ---");
    console.log("1. Получить список страниц");
    console.log("2. Поиск страниц");
    console.log("3. Получить содержимое страницы");
    console.log("4. Создать страницу");
    console.log("5. Обновить страницу");
    console.log("6. Удалить страницу");
    console.log("7. Получить список пользователей");
    console.log("8. Выход");

    const choice = await question("Выберите действие (1-8): ");

    try {
      if (choice === "1") {
        const limit = await question(
          "Введите лимит (или нажмите Enter для значения по умолчанию): "
        );
        const orderBy = await question(
          "Введите порядок сортировки (TITLE, CREATED, UPDATED или Enter для значения по умолчанию): "
        );

        const params = {};
        if (limit) params.limit = parseInt(limit);
        if (orderBy) params.orderBy = orderBy;

        const result = await callTool("list_pages", params);
        console.log("Результат:", JSON.stringify(result, null, 2));
      } else if (choice === "2") {
        const query = await question("Введите поисковый запрос: ");
        if (!query) {
          console.log("Поисковый запрос не может быть пустым");
          continue;
        }

        const limit = await question(
          "Введите лимит (или нажмите Enter для значения по умолчанию): "
        );
        const params = { query };
        if (limit) params.limit = parseInt(limit);

        const result = await callTool("search_pages", params);
        console.log("Результат:", JSON.stringify(result, null, 2));
      } else if (choice === "3") {
        const id = await question("Введите ID страницы: ");
        if (!id || isNaN(parseInt(id))) {
          console.log("ID должен быть числом");
          continue;
        }

        const result = await callTool("get_page_content", { id: parseInt(id) });
        console.log("Содержимое страницы:", result);
      } else if (choice === "4") {
        const title = await question("Введите заголовок страницы: ");
        const path = await question(
          "Введите путь страницы (например, folder/page): "
        );
        const description = await question(
          "Введите описание страницы (опционально): "
        );
        console.log(
          "Введите содержимое страницы (Markdown, завершите вводом пустой строки):"
        );

        let content = "";
        let line;
        while ((line = await question("> ")) !== "") {
          content += line + "\n";
        }

        if (!title || !path || !content) {
          console.log("Заголовок, путь и содержимое обязательны");
          continue;
        }

        const params = { title, path, content };
        if (description) params.description = description;

        const result = await callTool("create_page", params);
        console.log("Результат:", JSON.stringify(result, null, 2));
      } else if (choice === "5") {
        const id = await question("Введите ID страницы для обновления: ");
        if (!id || isNaN(parseInt(id))) {
          console.log("ID должен быть числом");
          continue;
        }

        console.log(
          "Введите новое содержимое страницы (Markdown, завершите вводом пустой строки):"
        );
        let content = "";
        let line;
        while ((line = await question("> ")) !== "") {
          content += line + "\n";
        }

        if (!content) {
          console.log("Содержимое не может быть пустым");
          continue;
        }

        const result = await callTool("update_page", {
          id: parseInt(id),
          content,
        });
        console.log("Результат:", JSON.stringify(result, null, 2));
      } else if (choice === "6") {
        const id = await question("Введите ID страницы для удаления: ");
        if (!id || isNaN(parseInt(id))) {
          console.log("ID должен быть числом");
          continue;
        }

        const confirm = await question(
          "Вы уверены, что хотите удалить страницу? (да/нет): "
        );
        if (confirm.toLowerCase() !== "да") {
          console.log("Операция отменена");
          continue;
        }

        const result = await callTool("delete_page", { id: parseInt(id) });
        console.log("Результат:", JSON.stringify(result, null, 2));
      } else if (choice === "7") {
        const result = await callTool("list_users", {});
        console.log("Список пользователей:", JSON.stringify(result, null, 2));
      } else if (choice === "8") {
        console.log("Завершение работы...");
        break;
      } else {
        console.log("Неверный выбор. Пожалуйста, выберите число от 1 до 8.");
      }
    } catch (error) {
      console.error(`Ошибка: ${error.message}`);
    }
  }

  rl.close();
}

// Основная функция
async function main() {
  try {
    await loadTools();
    await showInteractiveMenu();

    // Закрываем сервер после работы
    serverProcess.stdin.end();
    serverProcess.kill();
    process.exit(0);
  } catch (error) {
    console.error(`Критическая ошибка: ${error.message}`);
    serverProcess.kill();
    process.exit(1);
  }
}

main();
