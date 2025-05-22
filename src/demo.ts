import { WikiJsAgent } from "./agent.js";
import readline from "readline";

// Создание интерфейса для чтения ввода пользователя
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Настройка типа для ответа модели с поддержкой инструментов
interface LLMResponse {
  content?: string;
  tool_calls?: Array<{
    id: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

// Главная функция демонстрационного агента
async function runDemoAgent() {
  // Инициализация агента для работы с Wiki.js через MCP
  console.log("Инициализация демо-агента для Wiki.js...");
  const mcpUrl = process.env.MCP_URL || "http://localhost:8000";

  const agent = new WikiJsAgent(
    mcpUrl,
    "Вы - помощник для работы с Wiki.js. Вы отвечаете на вопросы пользователя о содержимом Wiki, " +
      "используя доступные инструменты для поиска и получения информации. " +
      "Используйте инструменты, когда это необходимо, чтобы получить актуальную информацию из Wiki."
  );

  try {
    // Проверка соединения с MCP сервером
    console.log(`Подключение к MCP серверу по адресу: ${mcpUrl}`);
    await agent.initialize();

    const health = await agent.checkHealth();
    console.log(`Статус MCP сервера: ${health.status} - ${health.message}`);

    if (health.status !== "ok") {
      console.error(
        "Не удалось подключиться к MCP серверу. Убедитесь, что сервер запущен."
      );
      process.exit(1);
    }

    console.log(`Загружено ${agent.getTools().length} инструментов.`);
    console.log("Демо-агент готов к работе!\n");

    // Бесконечный цикл для взаимодействия с пользователем
    await chatLoop(agent);
  } catch (error) {
    console.error("Ошибка при инициализации демо-агента:", error);
    process.exit(1);
  }
}

// Функция для имитации запроса к LLM
async function simulateLLMCall(
  prompt: string,
  tools: any[]
): Promise<LLMResponse> {
  console.log("\nСимуляция запроса к LLM...");

  // Это имитация ответа LLM. В реальном приложении здесь был бы запрос к API моделей

  // Простая логика для демонстрации работы с инструментами
  if (
    prompt.toLowerCase().includes("найди") ||
    prompt.toLowerCase().includes("поиск")
  ) {
    const searchTerm = prompt
      .split(" ")
      .slice(1)
      .join(" ")
      .replace(/['"]/g, "");
    return {
      tool_calls: [
        {
          id: "call_" + Date.now(),
          function: {
            name: "search_pages",
            arguments: JSON.stringify({ query: searchTerm }),
          },
        },
      ],
    };
  } else if (
    prompt.toLowerCase().includes("список") ||
    prompt.toLowerCase().includes("все страницы")
  ) {
    return {
      tool_calls: [
        {
          id: "call_" + Date.now(),
          function: {
            name: "list_pages",
            arguments: JSON.stringify({ limit: 10 }),
          },
        },
      ],
    };
  } else if (
    prompt.toLowerCase().includes("страница") &&
    prompt.toLowerCase().includes("id")
  ) {
    // Извлекаем ID из запроса
    const matches = prompt.match(/id\s*[=:]\s*(\d+)/i);
    const id = matches ? parseInt(matches[1]) : 1;
    return {
      tool_calls: [
        {
          id: "call_" + Date.now(),
          function: {
            name: "get_page",
            arguments: JSON.stringify({ id }),
          },
        },
      ],
    };
  } else if (
    prompt.toLowerCase().includes("контент") ||
    prompt.toLowerCase().includes("содержимое")
  ) {
    // Извлекаем ID из запроса
    const matches = prompt.match(/id\s*[=:]\s*(\d+)/i);
    const id = matches ? parseInt(matches[1]) : 1;
    return {
      tool_calls: [
        {
          id: "call_" + Date.now(),
          function: {
            name: "get_page_content",
            arguments: JSON.stringify({ id }),
          },
        },
      ],
    };
  } else {
    // Для других запросов просто возвращаем текстовый ответ
    return {
      content:
        "Я не понимаю, как выполнить этот запрос. Вы можете спросить о поиске страниц, просмотре списка страниц или получении страницы по ID.",
    };
  }
}

// Функция для имитации ответа на основе результатов вызова инструментов
function simulateResponseFromToolResults(results: any[]): string {
  // Здесь должна быть логика для обработки результатов инструментов
  // и формирования ответа пользователю

  const firstResult = results[0];

  if (!firstResult) {
    return "Извините, не удалось получить результаты.";
  }

  const content = JSON.parse(firstResult.content);

  if (firstResult.name === "search_pages") {
    if (content.error) {
      return `При поиске произошла ошибка: ${content.error}`;
    }

    if (!content.length) {
      return "По вашему запросу ничего не найдено.";
    }

    return (
      `Найдены следующие страницы (${content.length}):\n` +
      content
        .map(
          (page: any, i: number) =>
            `${i + 1}. "${page.title}" (ID: ${page.id}, путь: ${page.path})`
        )
        .join("\n")
    );
  }

  if (firstResult.name === "list_pages") {
    if (content.error) {
      return `При получении списка страниц произошла ошибка: ${content.error}`;
    }

    if (!content.length) {
      return "В Wiki нет страниц.";
    }

    return (
      `Список страниц (${content.length}):\n` +
      content
        .map(
          (page: any, i: number) => `${i + 1}. "${page.title}" (ID: ${page.id})`
        )
        .join("\n")
    );
  }

  if (firstResult.name === "get_page") {
    if (content.error) {
      return `При получении страницы произошла ошибка: ${content.error}`;
    }

    return (
      `Информация о странице:\n` +
      `Заголовок: ${content.title}\n` +
      `ID: ${content.id}\n` +
      `Путь: ${content.path}\n` +
      `Описание: ${content.description || "Нет описания"}\n` +
      `Создана: ${new Date(content.createdAt).toLocaleString()}\n` +
      `Обновлена: ${new Date(content.updatedAt).toLocaleString()}`
    );
  }

  if (firstResult.name === "get_page_content") {
    if (content.error) {
      return `При получении содержимого страницы произошла ошибка: ${content.error}`;
    }

    return `Содержимое страницы:\n\n${content.content}`;
  }

  return `Получены результаты от инструмента ${
    firstResult.name
  }: ${JSON.stringify(content, null, 2)}`;
}

// Цикл чата для взаимодействия с пользователем
async function chatLoop(agent: WikiJsAgent) {
  while (true) {
    // Получаем запрос от пользователя
    const userPrompt = await askQuestion(
      '\nВведите запрос (или "выход" для завершения): '
    );

    if (
      userPrompt.toLowerCase() === "выход" ||
      userPrompt.toLowerCase() === "exit"
    ) {
      console.log("Завершение работы демо-агента...");
      break;
    }

    // Создаем запрос к LLM
    const tools = agent.getTools();

    // Имитируем вызов LLM
    const llmResponse = await simulateLLMCall(userPrompt, tools);

    if (llmResponse.content) {
      // Просто текстовый ответ
      console.log(`\nОтвет: ${llmResponse.content}`);
    } else if (llmResponse.tool_calls && llmResponse.tool_calls.length > 0) {
      // Есть вызовы инструментов
      console.log("\nНеобходимо использовать инструменты для ответа...");

      // Обработка вызовов инструментов
      const toolResults = await agent.processLLMResponse(llmResponse);

      // Имитация формирования ответа на основе результатов
      const finalResponse = simulateResponseFromToolResults(toolResults);
      console.log(`\nОтвет: ${finalResponse}`);
    }
  }

  // Закрываем интерфейс чтения ввода
  rl.close();
}

// Вспомогательная функция для запроса ввода от пользователя
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Запуск демонстрационного агента
runDemoAgent().catch((error) => {
  console.error("Критическая ошибка:", error);
  process.exit(1);
});
