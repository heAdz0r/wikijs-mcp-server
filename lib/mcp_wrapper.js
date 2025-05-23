#!/usr/bin/env node

/**
 * Скрипт-обертка для запуска MCP сервера с конфигурацией из Cursor
 * Автоматически читает настройки из .cursor/mcp.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { spawn } from "child_process";
import { config as dotenvConfig } from "dotenv";

// Загружаем переменные окружения из .env файла
dotenvConfig();

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем конфигурацию из .cursor/mcp.json
function loadConfig() {
  try {
    // Сначала пробуем локальную конфигурацию
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const localConfigPath = path.join(process.cwd(), ".cursor", "mcp.json");
    const globalConfigPath = path.join(homeDir, ".cursor", "mcp.json");

    let config;

    if (fs.existsSync(localConfigPath)) {
      config = JSON.parse(fs.readFileSync(localConfigPath, "utf8"));
      console.log("Используется локальная конфигурация MCP");
    } else if (fs.existsSync(globalConfigPath)) {
      config = JSON.parse(fs.readFileSync(globalConfigPath, "utf8"));
      console.log("Используется глобальная конфигурация MCP");
    } else {
      console.warn(
        "Конфигурация MCP не найдена, используются значения по умолчанию"
      );
      return null;
    }

    return config;
  } catch (error) {
    console.error("Ошибка при загрузке конфигурации:", error);
    return null;
  }
}

// Загружаем конфигурацию
const config = loadConfig();

// Запускаем соответствующий MCP сервер
function startServer() {
  // Получаем настройки для Wiki.js
  if (config && config.mcpServers && config.mcpServers.wikijs) {
    const wikiJsConfig = config.mcpServers.wikijs;

    // Устанавливаем переменные окружения из конфигурации
    if (wikiJsConfig.env) {
      process.env = { ...process.env, ...wikiJsConfig.env };
      console.log("Переменные окружения настроены из конфигурации");
    }

    // Определяем, какой транспорт использовать
    const transport = wikiJsConfig.transport || "stdio";

    if (transport === "http") {
      // Запускаем HTTP сервер (исправленная версия)
      const serverProc = spawn("node", ["fixed_mcp_http_server.js"], {
        stdio: "inherit",
        cwd: __dirname,
      });

      console.log(`MCP HTTP сервер запущен, PID: ${serverProc.pid}`);

      // Обработка завершения
      serverProc.on("close", (code) => {
        console.log(`MCP HTTP сервер завершил работу с кодом ${code}`);
        process.exit(code);
      });
    } else {
      // Запускаем stdio сервер
      console.log("Запуск MCP сервера в режиме stdio");
      // Для stdio режима просто импортируем и запускаем mcp_wikijs_stdin.js
      import("./mcp_wikijs_stdin.js");
    }
  } else {
    console.error("Не удалось найти конфигурацию для Wiki.js MCP");
    process.exit(1);
  }
}

// Запускаем сервер
startServer();
