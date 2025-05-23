#!/usr/bin/env node

/**
 * HTTP клиент для Wiki.js MCP сервера
 * Демонстрирует использование MCP через HTTP транспорт
 */

import fetch from "node-fetch";
import readline from "readline";
import { config as dotenvConfig } from "dotenv";

// Загружаем переменные окружения из .env файла
dotenvConfig();

// Настройки
const SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3200";
let tools = [];

console.log(
  `Запуск HTTP клиента для Wiki.js MCP сервера по адресу ${SERVER_URL}...`
);

// Функция для проверки доступности сервера
async function checkServerHealth() {
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Статус сервера: ${data.status} - ${data.message}`);
    return data.status === "ok";
  } catch (error) {
    console.error(`Ошибка при проверке сервера: ${error.message}`);
    return false;
  }
}

// Функция для загрузки доступных инструментов
async function loadTools() {
  try {
    const response = await fetch(`${SERVER_URL}/tools`);
    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`);
    }

    const data = await response.json();
    tools = data;
    console.log(`Загружено ${data.length} инструментов:`);
    data.forEach((tool) => {
      console.log(` - ${tool.function.name}: ${tool.function.description}`);
    });
    return data;
  } catch (error) {
    console.error(`Ошибка при загрузке инструментов: ${error.message}`);
    throw error;
  }
}

// Функция для вызова инструмента
async function callTool(name, parameters) {
  try {
    console.log(`Вызов инструмента '${name}' с параметрами:`, parameters);

    // Определяем метод запроса на основе имени инструмента
    const method =
      name.startsWith("create_") ||
      name.startsWith("update_") ||
      name.startsWith("delete_")
        ? "POST"
        : "GET";

    let url = `${SERVER_URL}/${name}`;

    // Для GET-запросов преобразуем параметры в строку запроса
    if (method === "GET" && Object.keys(parameters).length > 0) {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(parameters)) {
        queryParams.append(key, String(value));
      }
      url += `?${queryParams.toString()}`;
    }

    // Выполняем запрос
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "POST" ? JSON.stringify(parameters) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ошибка ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Ошибка при вызове инструмента ${name}: ${error.message}`);
    throw error;
  }
}

// Интерактивное меню
async function showInteractiveMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function question(query) {
    return new Promise((resolve) => rl.question(query, resolve));
  }

  while (true) {
    console.log("\n--- Меню HTTP клиента Wiki.js MCP ---");
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
    // Проверяем доступность сервера
    const isHealthy = await checkServerHealth();
    if (!isHealthy) {
      console.log(
        "MCP сервер недоступен. Убедитесь, что сервер запущен по адресу " +
          SERVER_URL
      );
      process.exit(1);
    }

    // Загружаем инструменты
    await loadTools();

    // Показываем интерактивное меню
    await showInteractiveMenu();

    process.exit(0);
  } catch (error) {
    console.error(`Критическая ошибка: ${error.message}`);
    process.exit(1);
  }
}

main();
