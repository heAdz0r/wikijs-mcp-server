import fetch from "node-fetch";

// Класс агента для работы с MCP сервером Wiki.js
export class WikiJsAgent {
  private baseUrl: string;
  private tools: any[] = [];
  private systemMessage: string;

  constructor(baseUrl: string, systemMessage: string = "") {
    this.baseUrl = baseUrl;
    this.systemMessage = systemMessage;
  }

  // Инициализация агента - загрузка доступных инструментов
  async initialize(): Promise<void> {
    try {
      // Получаем список доступных инструментов с MCP сервера
      const response = await fetch(`${this.baseUrl}/tools`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      this.tools = data as any[];
      console.log(
        `Загружено ${this.tools.length} инструментов из MCP сервера.`
      );
    } catch (error) {
      console.error("Ошибка при инициализации агента:", error);
      throw error;
    }
  }

  // Проверка здоровья сервера
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data as { status: string; message: string };
    } catch (error) {
      console.error("Ошибка при проверке здоровья MCP сервера:", error);
      return {
        status: "error",
        message: `Ошибка соединения с MCP сервером: ${error}`,
      };
    }
  }

  // Получение доступных инструментов
  getTools(): any[] {
    return this.tools;
  }

  // Вызов инструмента MCP сервера
  async callTool(toolName: string, params: any = {}): Promise<any> {
    try {
      // Определяем метод запроса на основе имени инструмента
      const method =
        toolName.startsWith("create_") ||
        toolName.startsWith("update_") ||
        toolName.startsWith("delete_")
          ? "POST"
          : "GET";

      // Для GET-запросов преобразуем параметры в строку запроса
      let url = `${this.baseUrl}/${toolName}`;

      if (method === "GET" && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          queryParams.append(key, String(value));
        }
        url += `?${queryParams.toString()}`;
      }

      // Выполняем запрос к MCP серверу
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method === "POST" ? JSON.stringify(params) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Ошибка при вызове инструмента ${toolName}:`, error);
      throw error;
    }
  }

  // Создание запроса к LLM с использованием инструментов
  createLLMRequest(messages: any[] = [], useTools: boolean = true): any {
    return {
      model: "gpt-4",
      messages: [{ role: "system", content: this.systemMessage }, ...messages],
      tools: useTools ? this.tools : [],
      tool_choice: "auto",
    };
  }

  // Пример метода для обработки ответа LLM и выполнения вызовов инструментов
  async processLLMResponse(llmResponse: any): Promise<any> {
    if (!llmResponse.tool_calls || !llmResponse.tool_calls.length) {
      return llmResponse.content; // Нет вызовов инструментов
    }

    const results = [];
    for (const toolCall of llmResponse.tool_calls) {
      const toolName = toolCall.function.name;
      const params = JSON.parse(toolCall.function.arguments);
      try {
        const result = await this.callTool(toolName, params);
        results.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: toolName,
          content: JSON.stringify(result),
        });
      } catch (error) {
        results.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: toolName,
          content: JSON.stringify({ error: String(error) }),
        });
      }
    }
    return results;
  }
}

// Пример использования агента
async function example() {
  const agent = new WikiJsAgent(
    "http://localhost:8000",
    "Вы - помощник для работы с Wiki.js. Используйте доступные инструменты для выполнения задач пользователя."
  );

  try {
    // Инициализация агента
    await agent.initialize();

    // Проверка здоровья сервера
    const health = await agent.checkHealth();
    console.log("Статус MCP сервера:", health);

    // Пример вызова инструмента: получение списка страниц
    const pages = await agent.callTool("list_pages", { limit: 5 });
    console.log("Список страниц:", pages);

    // Пример использования в цикле чата с LLM
    const llmRequest = agent.createLLMRequest([
      {
        role: "user",
        content: 'Найди все страницы, связанные с термином "документация"',
      },
    ]);
    console.log("Запрос к LLM:", JSON.stringify(llmRequest, null, 2));

    // Здесь должен быть реальный вызов LLM API с llmRequest
    // Пример ответа LLM с вызовом инструмента
    const fakeLLMResponse = {
      tool_calls: [
        {
          id: "call_123",
          function: {
            name: "search_pages",
            arguments: JSON.stringify({ query: "документация" }),
          },
        },
      ],
    };

    // Обработка ответа и выполнение вызовов инструментов
    const toolResults = await agent.processLLMResponse(fakeLLMResponse);
    console.log("Результаты вызова инструментов:", toolResults);
  } catch (error) {
    console.error("Ошибка при выполнении примера:", error);
  }
}

// Запуск примера при прямом вызове скрипта
if (require.main === module) {
  example();
}
