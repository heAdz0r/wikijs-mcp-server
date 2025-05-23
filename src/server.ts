import fastify from "fastify";
import { WikiJsApi } from "./api.js";
import { wikiJsTools } from "./tools.js";
import { ServerConfig } from "./types.js";
import { config as dotenvConfig } from "dotenv";

// Загрузка переменных окружения из .env файла
dotenvConfig();

// Загрузка конфигурации из переменных окружения
const config: ServerConfig = {
  port: parseInt(process.env.PORT || "8000"),
  wikijs: {
    baseUrl: process.env.WIKIJS_BASE_URL || "http://localhost:3000",
    token: process.env.WIKIJS_TOKEN || "",
  },
};

// Вывод текущей конфигурации для отладки
console.log("Конфигурация MCP сервера:");
console.log(`PORT: ${config.port}`);
console.log(`WIKIJS_BASE_URL: ${config.wikijs.baseUrl}`);
console.log(`WIKIJS_TOKEN: ${config.wikijs.token.substring(0, 10)}...`);

// Создание экземпляра Fastify
const server = fastify({ logger: true });

// Создание экземпляра API Wiki.js
const wikiJsApi = new WikiJsApi(config.wikijs.baseUrl, config.wikijs.token);

// Маршрут для проверки здоровья сервера
server.get("/health", async () => {
  try {
    const isConnected = await wikiJsApi.checkConnection();
    return {
      status: isConnected ? "ok" : "error",
      message: isConnected
        ? "Connected to Wiki.js"
        : "Failed to connect to Wiki.js",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to connect to Wiki.js",
      error: String(error),
    };
  }
});

// Маршрут для получения списка доступных инструментов
server.get("/tools", async () => {
  return wikiJsTools;
});

// Маршруты для каждого инструмента
// Получение страницы по ID
server.get("/get_page", async (request) => {
  const { id } = request.query as { id: string };
  try {
    return await wikiJsApi.getPageById(parseInt(id));
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Получение контента страницы
server.get("/get_page_content", async (request) => {
  const { id } = request.query as { id: string };
  try {
    return { content: await wikiJsApi.getPageContent(parseInt(id)) };
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Получение списка страниц
server.get("/list_pages", async (request) => {
  const { limit, orderBy } = request.query as {
    limit?: string;
    orderBy?: string;
  };
  try {
    return await wikiJsApi.getPagesList(
      limit ? parseInt(limit) : undefined,
      orderBy || undefined
    );
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Поиск страниц
server.get("/search_pages", async (request) => {
  const { query, limit } = request.query as { query: string; limit?: string };
  try {
    return await wikiJsApi.searchPages(
      query,
      limit ? parseInt(limit) : undefined
    );
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Создание страницы
server.post("/create_page", async (request) => {
  const { title, content, path, description } = request.body as {
    title: string;
    content: string;
    path: string;
    description?: string;
  };
  try {
    return await wikiJsApi.createPage(title, content, path, description);
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Обновление страницы
server.post("/update_page", async (request) => {
  const { id, content } = request.body as { id: number; content: string };
  try {
    return await wikiJsApi.updatePage(id, content);
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Удаление страницы
server.post("/delete_page", async (request) => {
  const { id } = request.body as { id: number };
  try {
    return await wikiJsApi.deletePage(id);
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Получение списка пользователей
server.get("/list_users", async () => {
  try {
    return await wikiJsApi.getUsersList();
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Поиск пользователей
server.get("/search_users", async (request) => {
  const { query } = request.query as { query: string };
  try {
    return await wikiJsApi.searchUsers(query);
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Получение списка групп
server.get("/list_groups", async () => {
  try {
    return await wikiJsApi.getGroupsList();
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Создание пользователя
server.post("/create_user", async (request) => {
  const {
    email,
    name,
    passwordRaw,
    providerKey,
    groups,
    mustChangePassword,
    sendWelcomeEmail,
  } = request.body as {
    email: string;
    name: string;
    passwordRaw: string;
    providerKey?: string;
    groups?: number[];
    mustChangePassword?: boolean;
    sendWelcomeEmail?: boolean;
  };
  try {
    return await wikiJsApi.createUser(
      email,
      name,
      passwordRaw,
      providerKey,
      groups,
      mustChangePassword,
      sendWelcomeEmail
    );
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Обновление пользователя
server.post("/update_user", async (request) => {
  const { id, name } = request.body as { id: number; name: string };
  try {
    return await wikiJsApi.updateUser(id, name);
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Получение всех страниц включая неопубликованные
server.get("/list_all_pages", async (request) => {
  const { limit, orderBy, includeUnpublished } = request.query as {
    limit?: string;
    orderBy?: string;
    includeUnpublished?: string;
  };
  try {
    return await wikiJsApi.getAllPagesList(
      limit ? parseInt(limit) : undefined,
      orderBy || undefined,
      includeUnpublished !== "false"
    );
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Поиск неопубликованных страниц
server.get("/search_unpublished_pages", async (request) => {
  const { query, limit } = request.query as { query: string; limit?: string };
  try {
    return await wikiJsApi.searchUnpublishedPages(
      query,
      limit ? parseInt(limit) : undefined
    );
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Принудительное удаление страницы
server.post("/force_delete_page", async (request) => {
  const { id } = request.body as { id: number };
  try {
    return await wikiJsApi.forceDeletePage(id);
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Получение статуса публикации страницы
server.get("/get_page_status", async (request) => {
  const { id } = request.query as { id: string };
  try {
    return await wikiJsApi.getPageStatus(parseInt(id));
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Публикация страницы
server.post("/publish_page", async (request) => {
  const { id } = request.body as { id: number };
  try {
    return await wikiJsApi.publishPage(id);
  } catch (error) {
    server.log.error(error);
    return { error: String(error) };
  }
});

// Запуск сервера
const start = async () => {
  try {
    // Проверка соединения с Wiki.js перед запуском сервера
    const isConnected = await wikiJsApi.checkConnection();
    if (!isConnected) {
      console.warn(
        "⚠️ Не удалось подключиться к Wiki.js API. Сервер запущен, но функциональность будет ограничена."
      );
      // Не выходим из процесса, а продолжаем работу
      // process.exit(1);
    }

    await server.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`MCP сервер для Wiki.js запущен на порту ${config.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
