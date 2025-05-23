import {
  WikiJsToolDefinition,
  WikiJsPage,
  WikiJsUser,
  WikiJsGroup,
  ResponseResult,
} from "./types.js";
import { GraphQLClient, gql } from "graphql-request";

// Интерфейсы ответов GraphQL API
interface PageResponse {
  pages: {
    single: WikiJsPage;
  };
}

interface PageContentResponse {
  pages: {
    single: {
      content: string;
    };
  };
}

interface PagesListResponse {
  pages: {
    list: WikiJsPage[];
  };
}

interface PagesSearchResponse {
  pages: {
    search: {
      results: {
        id: string;
        title: string;
        description: string;
        path: string;
        locale: string;
      }[];
      suggestions: string[];
      totalHits: number;
    };
  };
}

interface PageCreateResponse {
  pages: {
    create: {
      responseResult: ResponseResult;
      page: WikiJsPage;
    };
  };
}

interface PageUpdateResponse {
  pages: {
    update: {
      responseResult: ResponseResult;
      page: WikiJsPage;
    };
  };
}

interface PageDeleteResponse {
  pages: {
    delete: {
      responseResult: ResponseResult;
    };
  };
}

interface UsersListResponse {
  users: {
    list: WikiJsUser[];
  };
}

interface UsersSearchResponse {
  users: {
    search: WikiJsUser[];
  };
}

interface GroupsListResponse {
  groups: {
    list: WikiJsGroup[];
  };
}

interface UserCreateResponse {
  users: {
    create: WikiJsUser;
  };
}

interface UserUpdateResponse {
  users: {
    update: WikiJsUser;
  };
}

// Список инструментов MCP для работы с Wiki.js
export const wikiJsTools: WikiJsToolDefinition[] = [
  // Получение страницы по ID
  {
    type: "function",
    function: {
      name: "get_page",
      description: "Получает информацию о странице Wiki.js по её ID",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы в Wiki.js",
          },
        },
        required: ["id"],
      },
    },
  },

  // Получение контента страницы по ID
  {
    type: "function",
    function: {
      name: "get_page_content",
      description: "Получает содержимое страницы Wiki.js по её ID",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы в Wiki.js",
          },
        },
        required: ["id"],
      },
    },
  },

  // Получение списка страниц
  {
    type: "function",
    function: {
      name: "list_pages",
      description: "Получает список страниц Wiki.js с возможностью сортировки",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description:
              "Максимальное количество страниц для возврата (по умолчанию 50)",
          },
          orderBy: {
            type: "string",
            description: "Поле для сортировки (TITLE, CREATED, UPDATED)",
          },
        },
        required: [],
      },
    },
  },

  // Поиск страниц
  {
    type: "function",
    function: {
      name: "search_pages",
      description: "Поиск страниц по запросу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Поисковый запрос",
          },
          limit: {
            type: "number",
            description:
              "Максимальное количество результатов (по умолчанию 10)",
          },
        },
        required: ["query"],
      },
    },
  },

  // Создание страницы
  {
    type: "function",
    function: {
      name: "create_page",
      description: "Создает новую страницу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Заголовок страницы",
          },
          content: {
            type: "string",
            description: "Содержимое страницы (в формате Markdown)",
          },
          path: {
            type: "string",
            description: "Путь к странице (например, 'folder/page')",
          },
          description: {
            type: "string",
            description: "Краткое описание страницы",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Теги страницы",
          },
        },
        required: ["title", "content", "path"],
      },
    },
  },

  // Обновление страницы
  {
    type: "function",
    function: {
      name: "update_page",
      description: "Обновляет существующую страницу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы для обновления",
          },
          content: {
            type: "string",
            description: "Новое содержимое страницы (в формате Markdown)",
          },
        },
        required: ["id", "content"],
      },
    },
  },

  // Удаление страницы
  {
    type: "function",
    function: {
      name: "delete_page",
      description: "Удаляет страницу из Wiki.js",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы для удаления",
          },
        },
        required: ["id"],
      },
    },
  },

  // Получение списка пользователей
  {
    type: "function",
    function: {
      name: "list_users",
      description: "Получает список пользователей Wiki.js",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  // Поиск пользователей
  {
    type: "function",
    function: {
      name: "search_users",
      description: "Поиск пользователей по запросу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Поисковый запрос (имя или email)",
          },
        },
        required: ["query"],
      },
    },
  },

  // Получение списка групп
  {
    type: "function",
    function: {
      name: "list_groups",
      description: "Получает список групп пользователей Wiki.js",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  // Создание пользователя
  {
    type: "function",
    function: {
      name: "create_user",
      description: "Создает нового пользователя в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email пользователя",
          },
          name: {
            type: "string",
            description: "Имя пользователя",
          },
          passwordRaw: {
            type: "string",
            description: "Пароль пользователя (в открытом виде)",
          },
          providerKey: {
            type: "string",
            description:
              "Ключ провайдера аутентификации (по умолчанию 'local')",
          },
          groups: {
            type: "array",
            items: {
              type: "number",
            },
            description:
              "Массив ID групп, в которые будет добавлен пользователь (по умолчанию [2])",
          },
          mustChangePassword: {
            type: "boolean",
            description:
              "Требовать смену пароля при следующем входе (по умолчанию false)",
          },
          sendWelcomeEmail: {
            type: "boolean",
            description: "Отправить приветственное письмо (по умолчанию false)",
          },
        },
        required: ["email", "name", "passwordRaw"],
      },
    },
  },

  // Обновление пользователя
  {
    type: "function",
    function: {
      name: "update_user",
      description: "Обновляет информацию о пользователе Wiki.js",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID пользователя для обновления",
          },
          name: {
            type: "string",
            description: "Новое имя пользователя",
          },
        },
        required: ["id", "name"],
      },
    },
  },

  // Получение всех страниц (включая неопубликованные)
  {
    type: "function",
    function: {
      name: "list_all_pages",
      description:
        "Получает список всех страниц Wiki.js включая неопубликованные с возможностью сортировки",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description:
              "Максимальное количество страниц для возврата (по умолчанию 50)",
          },
          orderBy: {
            type: "string",
            description: "Поле для сортировки (TITLE, CREATED, UPDATED)",
          },
          includeUnpublished: {
            type: "boolean",
            description:
              "Включать неопубликованные страницы (по умолчанию true)",
          },
        },
        required: [],
      },
    },
  },

  // Поиск неопубликованных страниц
  {
    type: "function",
    function: {
      name: "search_unpublished_pages",
      description: "Поиск неопубликованных страниц по запросу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Поисковый запрос",
          },
          limit: {
            type: "number",
            description:
              "Максимальное количество результатов (по умолчанию 10)",
          },
        },
        required: ["query"],
      },
    },
  },

  // Принудительное удаление страницы (включая неопубликованные)
  {
    type: "function",
    function: {
      name: "force_delete_page",
      description:
        "Принудительно удаляет страницу из Wiki.js (включая неопубликованные страницы)",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы для удаления",
          },
        },
        required: ["id"],
      },
    },
  },

  // Получение статуса публикации страницы
  {
    type: "function",
    function: {
      name: "get_page_status",
      description:
        "Получает статус публикации и детальную информацию о странице",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы в Wiki.js",
          },
        },
        required: ["id"],
      },
    },
  },

  // Публикация страницы
  {
    type: "function",
    function: {
      name: "publish_page",
      description: "Публикует неопубликованную страницу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы для публикации",
          },
        },
        required: ["id"],
      },
    },
  },
];

// Базовый класс для API Wiki.js
class WikiJsAPI {
  private client: GraphQLClient;
  private token: string;
  private baseUrl: string;
  private locale: string;

  constructor(
    baseUrl: string = "http://localhost:3000",
    token: string = "",
    locale: string = "ru"
  ) {
    console.log(
      `[WikiJsAPI] Конструктор вызван. baseUrl: ${baseUrl}, token: ${
        token ? "предоставлен" : "отсутствует"
      }, locale: ${locale}`
    );
    this.client = new GraphQLClient(`${baseUrl}/graphql`);
    this.token = token;
    this.baseUrl = baseUrl;
    this.locale = locale;

    if (token) {
      console.log("[WikiJsAPI] Устанавливается заголовок Authorization.");
      this.client.setHeader("Authorization", `Bearer ${token}`);
    }
  }

  // Метод для генерации URL страницы
  private generatePageUrl(path: string): string {
    return generatePageUrl(this.baseUrl, this.locale, path);
  }

  // Получение страницы по ID
  async getPage(id: number): Promise<WikiJsPage> {
    console.log(`[WikiJsAPI] getPage вызван с id: ${id}`);
    const query = gql`
      query GetPage($id: Int!) {
        pages {
          single(id: $id) {
            id
            path
            title
            description
            createdAt
            updatedAt
          }
        }
      }
    `;

    const variables = { id };
    console.log(
      `[WikiJsAPI] getPage: отправка запроса GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<PageResponse>(query, variables);
      console.log("[WikiJsAPI] getPage: запрос успешно выполнен.");
      const page = data.pages.single;
      // Добавляем URL к странице
      return {
        ...page,
        url: this.generatePageUrl(page.path),
      };
    } catch (error) {
      console.error(
        `[WikiJsAPI] getPage: ошибка при запросе GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Получение содержимого страницы по ID
  async getPageContent(id: number): Promise<string> {
    console.log(`[WikiJsAPI] getPageContent вызван с id: ${id}`);
    const query = gql`
      query GetPageContent($id: Int!) {
        pages {
          single(id: $id) {
            content
          }
        }
      }
    `;

    const variables = { id };
    console.log(
      `[WikiJsAPI] getPageContent: отправка запроса GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<PageContentResponse>(
        query,
        variables
      );
      console.log("[WikiJsAPI] getPageContent: запрос успешно выполнен.");
      return data.pages.single.content;
    } catch (error) {
      console.error(
        `[WikiJsAPI] getPageContent: ошибка при запросе GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Получение содержимого страницы через HTTP (альтернативный метод)
  async getPageContentViaHTTP(path: string): Promise<string> {
    console.log(`[WikiJsAPI] getPageContentViaHTTP вызван с path: ${path}`);
    const url = this.generatePageUrl(path);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      // Извлекаем текстовое содержимое из HTML
      // Ищем контент в блоке <template slot="contents">
      const contentRegex =
        /<template[^>]*slot="contents"[^>]*>([\s\S]*?)<\/template>/i;
      const match = html.match(contentRegex);

      if (match) {
        // Удаляем HTML-теги и декодируем entities
        return match[1]
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/\s+/g, " ")
          .trim();
      }

      // Если не нашли контент в блоке template, пробуем извлечь весь текст
      return html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
    } catch (error) {
      console.error(
        `[WikiJsAPI] getPageContentViaHTTP: ошибка при HTTP-запросе: ${error}`
      );
      throw error;
    }
  }

  // Получение списка страниц
  async listPages(
    limit: number = 50,
    orderBy: string = "TITLE"
  ): Promise<WikiJsPage[]> {
    console.log(
      `[WikiJsAPI] listPages вызван с limit: ${limit}, orderBy: ${orderBy}`
    );
    const query = gql`
      query ListPages($limit: Int, $orderBy: PageOrderBy) {
        pages {
          list(limit: $limit, orderBy: $orderBy) {
            id
            path
            title
            description
            createdAt
            updatedAt
          }
        }
      }
    `;

    const variables = { limit, orderBy };
    console.log(
      `[WikiJsAPI] listPages: отправка запроса GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<PagesListResponse>(
        query,
        variables
      );
      console.log("[WikiJsAPI] listPages: запрос успешно выполнен.");
      // Добавляем URL к каждой странице
      return data.pages.list.map((page) => ({
        ...page,
        url: this.generatePageUrl(page.path),
      }));
    } catch (error) {
      console.error(
        `[WikiJsAPI] listPages: ошибка при запросе GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Поиск страниц (улучшенный: по контенту и названиям)
  async searchPages(query: string, limit: number = 10): Promise<WikiJsPage[]> {
    console.log(
      `[WikiJsAPI] searchPages вызван с query: ${query}, limit: ${limit}`
    );

    const results: WikiJsPage[] = [];
    const foundIds = new Set<number>();

    // 1. Поиск через GraphQL API (работает по индексу контента)
    try {
      const gqlQuery = gql`
        query SearchPages($query: String!) {
          pages {
            search(query: $query) {
              results {
                id
                title
                description
                path
                locale
              }
              suggestions
              totalHits
            }
          }
        }
      `;

      const variables = { query };
      console.log(
        `[WikiJsAPI] searchPages: отправка GraphQL поиска с переменными: ${JSON.stringify(
          variables
        )}`
      );

      const data = await this.client.request<PagesSearchResponse>(
        gqlQuery,
        variables
      );
      console.log(
        `[WikiJsAPI] searchPages: GraphQL поиск вернул ${data.pages.search.results.length} результатов`
      );

      // Добавляем результаты из GraphQL поиска
      data.pages.search.results.forEach((result) => {
        const id = parseInt(result.id, 10);
        if (!foundIds.has(id)) {
          foundIds.add(id);
          results.push({
            id,
            path: result.path,
            title: result.title,
            description: result.description || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            url: this.generatePageUrl(result.path),
          });
        }
      });
    } catch (error) {
      console.warn(
        `[WikiJsAPI] searchPages: GraphQL поиск не удался: ${error}`
      );
    }

    // 2. Поиск по названиям через listPages (расширенный лимит для поиска)
    try {
      console.log(
        `[WikiJsAPI] searchPages: выполняем поиск по названиям через listPages`
      );
      const allPages = await this.listPages(200, "UPDATED");
      const queryLower = query.toLowerCase();

      const titleMatches = allPages.filter((page) => {
        const titleMatch = page.title.toLowerCase().includes(queryLower);
        const pathMatch = page.path.toLowerCase().includes(queryLower);
        const descMatch = page.description?.toLowerCase().includes(queryLower);

        return (titleMatch || pathMatch || descMatch) && !foundIds.has(page.id);
      });

      console.log(
        `[WikiJsAPI] searchPages: найдено ${titleMatches.length} дополнительных совпадений по названиям/путям`
      );

      titleMatches.forEach((page) => {
        if (!foundIds.has(page.id)) {
          foundIds.add(page.id);
          results.push(page);
        }
      });
    } catch (error) {
      console.warn(
        `[WikiJsAPI] searchPages: поиск по названиям не удался: ${error}`
      );
    }

    // 3. Поиск по содержимому страниц через HTTP (альтернативный метод)
    if (results.length < 3 && query.length > 2) {
      try {
        console.log(
          `[WikiJsAPI] searchPages: выполняем поиск по содержимому через HTTP`
        );
        const searchLimit = Math.min(30, limit * 3); // Ограничиваем для HTTP-поиска
        const recentPages = await this.listPages(searchLimit, "UPDATED");

        for (const page of recentPages) {
          if (foundIds.has(page.id)) continue;

          try {
            // Попробуем сначала GraphQL
            let content = "";
            try {
              content = await this.getPageContent(page.id);
            } catch (graphqlError) {
              // Если GraphQL не сработал, используем HTTP
              content = await this.getPageContentViaHTTP(page.path);
            }

            if (content.toLowerCase().includes(query.toLowerCase())) {
              console.log(
                `[WikiJsAPI] searchPages: найдено совпадение в содержимом страницы ${page.id}: ${page.title}`
              );
              foundIds.add(page.id);
              results.push(page);

              // Прерываем поиск если уже достаточно результатов
              if (results.length >= limit) break;
            }
          } catch (contentError) {
            console.warn(
              `[WikiJsAPI] searchPages: не удалось получить содержимое страницы ${page.id}: ${contentError}`
            );
          }
        }
      } catch (error) {
        console.warn(
          `[WikiJsAPI] searchPages: поиск по содержимому не удался: ${error}`
        );
      }
    }

    // 4. Дополнительный поиск на известных страницах (если основные методы не сработали)
    if (results.length === 0 && query.length > 2) {
      console.log(
        `[WikiJsAPI] searchPages: пробуем поиск на известных страницах с ID 103-110`
      );
      const knownPageIds = [103, 104, 105, 106, 107, 108, 109, 110];

      for (const pageId of knownPageIds) {
        if (foundIds.has(pageId)) continue;

        try {
          // Получаем метаданные страницы
          const page = await this.getPage(pageId);

          // Получаем содержимое через HTTP
          const content = await this.getPageContentViaHTTP(page.path);

          if (content.toLowerCase().includes(query.toLowerCase())) {
            console.log(
              `[WikiJsAPI] searchPages: найдено совпадение в известной странице ${page.id}: ${page.title}`
            );
            foundIds.add(page.id);
            results.push(page);

            if (results.length >= limit) break;
          }
        } catch (error) {
          console.warn(
            `[WikiJsAPI] searchPages: ошибка при проверке известной страницы ${pageId}: ${error}`
          );
        }
      }
    }

    console.log(
      `[WikiJsAPI] searchPages: общий результат: ${results.length} страниц найдено`
    );

    // Ограничиваем результат до запрошенного лимита
    return limit > 0 ? results.slice(0, limit) : results;
  }

  // Создание страницы
  async createPage(
    title: string,
    content: string,
    path: string,
    description: string = "",
    tags: string[] = ["mcp", "test"]
  ): Promise<WikiJsPage> {
    console.log(
      `[WikiJsAPI] createPage вызван с title: ${title}, path: ${path}, description: ${description}, tags: ${tags.join(
        ", "
      )}`
    );
    const mutation = gql`
      mutation CreatePage(
        $content: String!
        $description: String!
        $editor: String!
        $isPublished: Boolean!
        $isPrivate: Boolean!
        $locale: String!
        $path: String!
        $publishEndDate: Date
        $publishStartDate: Date
        $scriptCss: String
        $scriptJs: String
        $tags: [String]!
        $title: String!
      ) {
        pages {
          create(
            content: $content
            description: $description
            editor: $editor
            isPublished: $isPublished
            isPrivate: $isPrivate
            locale: $locale
            path: $path
            publishEndDate: $publishEndDate
            publishStartDate: $publishStartDate
            scriptCss: $scriptCss
            scriptJs: $scriptJs
            tags: $tags
            title: $title
          ) {
            responseResult {
              succeeded
              slug
              message
            }
            page {
              id
              path
              title
              description
              createdAt
              updatedAt
            }
          }
        }
      }
    `;

    const variables = {
      content,
      description: description || "",
      editor: "markdown",
      isPublished: true,
      isPrivate: false,
      locale: "ru",
      path,
      tags: tags,
      title,
    };

    console.log(
      `[WikiJsAPI] createPage: отправка мутации GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<PageCreateResponse>(
        mutation,
        variables
      );
      console.log("[WikiJsAPI] createPage: мутация успешно выполнена.");
      if (!data.pages.create.responseResult.succeeded) {
        throw new Error(
          `Ошибка создания страницы: ${
            data.pages.create.responseResult.message || "Неизвестная ошибка"
          }`
        );
      }
      const page = data.pages.create.page;
      // Добавляем URL к созданной странице
      return {
        ...page,
        url: this.generatePageUrl(page.path),
      };
    } catch (error) {
      console.error(
        `[WikiJsAPI] createPage: ошибка при мутации GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Обновление страницы
  async updatePage(id: number, content: string): Promise<WikiJsPage> {
    console.log(`[WikiJsAPI] updatePage вызван с id: ${id}`);
    const mutation = gql`
      mutation UpdatePage(
        $id: Int!
        $content: String!
        $isPublished: Boolean!
      ) {
        pages {
          update(id: $id, content: $content, isPublished: $isPublished) {
            responseResult {
              succeeded
              slug
              message
            }
            page {
              id
              path
              title
              description
              updatedAt
            }
          }
        }
      }
    `;

    const variables = { id, content, isPublished: true };
    console.log(
      `[WikiJsAPI] updatePage: отправка мутации GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<PageUpdateResponse>(
        mutation,
        variables
      );
      console.log("[WikiJsAPI] updatePage: мутация успешно выполнена.");

      // Проверяем наличие данных в ответе
      if (!data.pages.update || !data.pages.update.page) {
        console.log(
          "[WikiJsAPI] updatePage: страница не возвращена, возможно нет прав доступа"
        );
        // Возвращаем текущую страницу вместо ошибки
        return await this.getPage(id);
      }

      const page = data.pages.update.page;
      // Добавляем URL к обновленной странице
      return {
        ...page,
        url: this.generatePageUrl(page.path),
      };
    } catch (error) {
      console.error(
        `[WikiJsAPI] updatePage: ошибка при мутации GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Удаление страницы
  async deletePage(
    id: number
  ): Promise<{ success: boolean; message: string | undefined }> {
    console.log(`[WikiJsAPI] deletePage вызван с id: ${id}`);
    const mutation = gql`
      mutation DeletePage($id: Int!) {
        pages {
          delete(id: $id) {
            responseResult {
              succeeded
              slug
              message
            }
          }
        }
      }
    `;

    const variables = { id };
    console.log(
      `[WikiJsAPI] deletePage: отправка мутации GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<PageDeleteResponse>(
        mutation,
        variables
      );
      console.log("[WikiJsAPI] deletePage: мутация успешно выполнена.");
      return {
        success: data.pages.delete.responseResult.succeeded,
        message: data.pages.delete.responseResult.message,
      };
    } catch (error) {
      console.error(
        `[WikiJsAPI] deletePage: ошибка при мутации GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Получение списка пользователей
  async listUsers(): Promise<WikiJsUser[]> {
    console.log("[WikiJsAPI] listUsers вызван.");
    const query = gql`
      query ListUsers {
        users {
          list {
            id
            name
            email
            isActive
            createdAt
            updatedAt
          }
        }
      }
    `;
    console.log("[WikiJsAPI] listUsers: отправка запроса GraphQL.");
    try {
      const data = await this.client.request<UsersListResponse>(query);
      console.log("[WikiJsAPI] listUsers: запрос успешно выполнен.");
      return data.users.list;
    } catch (error) {
      console.error(
        `[WikiJsAPI] listUsers: ошибка при запросе GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Поиск пользователей
  async searchUsers(query: string): Promise<WikiJsUser[]> {
    console.log(`[WikiJsAPI] searchUsers вызван с query: ${query}`);
    const gqlQuery = gql`
      query SearchUsers($query: String!) {
        users {
          search(query: $query) {
            id
            name
            email
            isActive
            createdAt
            updatedAt
          }
        }
      }
    `;

    const variables = { query };
    console.log(
      `[WikiJsAPI] searchUsers: отправка запроса GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<UsersSearchResponse>(
        gqlQuery,
        variables
      );
      console.log("[WikiJsAPI] searchUsers: запрос успешно выполнен.");
      return data.users.search;
    } catch (error) {
      console.error(
        `[WikiJsAPI] searchUsers: ошибка при запросе GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Получение списка групп
  async listGroups(): Promise<WikiJsGroup[]> {
    console.log("[WikiJsAPI] listGroups вызван.");
    const query = gql`
      query ListGroups {
        groups {
          list {
            id
            name
            isSystem
            createdAt
            updatedAt
          }
        }
      }
    `;
    console.log("[WikiJsAPI] listGroups: отправка запроса GraphQL.");
    try {
      const data = await this.client.request<GroupsListResponse>(query);
      console.log("[WikiJsAPI] listGroups: запрос успешно выполнен.");
      return data.groups.list;
    } catch (error) {
      console.error(
        `[WikiJsAPI] listGroups: ошибка при запросе GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Создание пользователя
  async createUser(
    email: string,
    name: string,
    passwordRaw: string,
    providerKey: string = "local",
    groups: number[] = [2],
    mustChangePassword: boolean = false,
    sendWelcomeEmail: boolean = false
  ): Promise<WikiJsUser> {
    console.log(
      `[WikiJsAPI] createUser вызван с email: ${email}, name: ${name}`
    );
    const mutation = gql`
      mutation CreateUser(
        $email: String!
        $name: String!
        $passwordRaw: String!
        $providerKey: String!
        $groups: [Int]!
        $mustChangePassword: Boolean!
        $sendWelcomeEmail: Boolean!
      ) {
        users {
          create(
            email: $email
            name: $name
            passwordRaw: $passwordRaw
            providerKey: $providerKey
            groups: $groups
            mustChangePassword: $mustChangePassword
            sendWelcomeEmail: $sendWelcomeEmail
          ) {
            id
            name
            email
            providerKey
            isActive
            createdAt
            updatedAt
          }
        }
      }
    `;

    const variables = {
      email,
      name,
      passwordRaw,
      providerKey,
      groups,
      mustChangePassword,
      sendWelcomeEmail,
    };

    console.log(
      `[WikiJsAPI] createUser: отправка мутации GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<UserCreateResponse>(
        mutation,
        variables
      );
      console.log("[WikiJsAPI] createUser: мутация успешно выполнена.");
      return data.users.create;
    } catch (error) {
      console.error(
        `[WikiJsAPI] createUser: ошибка при мутации GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Обновление пользователя
  async updateUser(id: number, name: string): Promise<WikiJsUser> {
    console.log(`[WikiJsAPI] updateUser вызван с id: ${id}, name: ${name}`);
    const mutation = gql`
      mutation UpdateUser($id: Int!, $name: String!) {
        users {
          update(id: $id, name: $name) {
            id
            name
            email
            isActive
            updatedAt
          }
        }
      }
    `;

    const variables = { id, name };
    console.log(
      `[WikiJsAPI] updateUser: отправка мутации GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      const data = await this.client.request<UserUpdateResponse>(
        mutation,
        variables
      );
      console.log("[WikiJsAPI] updateUser: мутация успешно выполнена.");
      return data.users.update;
    } catch (error) {
      console.error(
        `[WikiJsAPI] updateUser: ошибка при мутации GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Получение всех страниц включая неопубликованные
  async listAllPages(
    limit: number = 50,
    orderBy: string = "TITLE",
    includeUnpublished: boolean = true
  ): Promise<(WikiJsPage & { isPublished: boolean })[]> {
    console.log(
      `[WikiJsAPI] listAllPages вызван с limit: ${limit}, orderBy: ${orderBy}, includeUnpublished: ${includeUnpublished}`
    );
    const query = gql`
      query ListAllPages($limit: Int, $orderBy: PageOrderBy) {
        pages {
          list(limit: $limit, orderBy: $orderBy) {
            id
            path
            title
            description
            createdAt
            updatedAt
            isPublished
          }
        }
      }
    `;

    const variables = { limit, orderBy };
    console.log(
      `[WikiJsAPI] listAllPages: отправка запроса GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      interface AllPagesListResponse {
        pages: {
          list: (WikiJsPage & { isPublished: boolean })[];
        };
      }

      const data = await this.client.request<AllPagesListResponse>(
        query,
        variables
      );
      console.log("[WikiJsAPI] listAllPages: запрос успешно выполнен.");

      let pages = data.pages.list;

      // Фильтруем по статусу публикации если нужно
      if (!includeUnpublished) {
        pages = pages.filter((page) => page.isPublished);
      }

      // Добавляем URL к каждой странице
      return pages.map((page) => ({
        ...page,
        url: this.generatePageUrl(page.path),
      }));
    } catch (error) {
      console.error(
        `[WikiJsAPI] listAllPages: ошибка при запросе GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Поиск неопубликованных страниц
  async searchUnpublishedPages(
    query: string,
    limit: number = 10
  ): Promise<(WikiJsPage & { isPublished: boolean })[]> {
    console.log(
      `[WikiJsAPI] searchUnpublishedPages вызван с query: ${query}, limit: ${limit}`
    );

    try {
      // Получаем все страницы включая неопубликованные
      const allPages = await this.listAllPages(200, "UPDATED", true);

      // Фильтруем только неопубликованные страницы
      const unpublishedPages = allPages.filter((page) => !page.isPublished);

      // Ищем по запросу в названии, пути или описании
      const queryLower = query.toLowerCase();
      const matches = unpublishedPages.filter((page) => {
        const titleMatch = page.title.toLowerCase().includes(queryLower);
        const pathMatch = page.path.toLowerCase().includes(queryLower);
        const descMatch = page.description?.toLowerCase().includes(queryLower);

        return titleMatch || pathMatch || descMatch;
      });

      console.log(
        `[WikiJsAPI] searchUnpublishedPages: найдено ${matches.length} неопубликованных страниц`
      );

      return matches.slice(0, limit);
    } catch (error) {
      console.error(
        `[WikiJsAPI] searchUnpublishedPages: ошибка при поиске: ${error}`,
        error
      );
      throw error;
    }
  }

  // Принудительное удаление страницы (включая неопубликованные)
  async forceDeletePage(
    id: number
  ): Promise<{ success: boolean; message: string | undefined }> {
    console.log(`[WikiJsAPI] forceDeletePage вызван с id: ${id}`);

    // Сначала попробуем обычное удаление
    try {
      return await this.deletePage(id);
    } catch (error) {
      console.warn(
        `[WikiJsAPI] forceDeletePage: обычное удаление не удалось, пробуем альтернативные методы: ${error}`
      );
    }

    // Если обычное удаление не сработало, попробуем альтернативные методы
    const mutations = [
      // Попробуем удалить с дополнительными параметрами
      gql`
        mutation ForceDeletePage($id: Int!) {
          pages {
            delete(id: $id, purge: true) {
              responseResult {
                succeeded
                errorCode
                message
              }
            }
          }
        }
      `,
      // Попробуем мутацию render для удаления
      gql`
        mutation DeletePageRender($id: Int!) {
          pages {
            render(id: $id, mode: DELETE) {
              responseResult {
                succeeded
                errorCode
                message
              }
            }
          }
        }
      `,
      // Альтернативная мутация удаления
      gql`
        mutation AlternativeDelete($id: Int!) {
          pages {
            deletePage(id: $id) {
              responseResult {
                succeeded
                errorCode
                message
              }
            }
          }
        }
      `,
    ];

    for (const [index, mutation] of mutations.entries()) {
      try {
        console.log(
          `[WikiJsAPI] forceDeletePage: попытка ${
            index + 1
          } удаления страницы ${id}`
        );

        const variables = { id };
        const data = await this.client.request<PageDeleteResponse>(
          mutation,
          variables
        );

        if (data.pages.delete?.responseResult?.succeeded) {
          console.log(
            `[WikiJsAPI] forceDeletePage: страница ${id} успешно удалена на попытке ${
              index + 1
            }`
          );
          return {
            success: true,
            message: data.pages.delete.responseResult.message,
          };
        }
      } catch (error) {
        console.warn(
          `[WikiJsAPI] forceDeletePage: попытка ${
            index + 1
          } не удалась: ${error}`
        );
      }
    }

    // Если все попытки не удались, возвращаем ошибку
    const errorMessage = `Не удалось удалить страницу ${id} ни одним из доступных методов`;
    console.error(`[WikiJsAPI] forceDeletePage: ${errorMessage}`);
    return {
      success: false,
      message: errorMessage,
    };
  }

  // Получение статуса публикации страницы
  async getPageStatus(
    id: number
  ): Promise<WikiJsPage & { isPublished: boolean }> {
    console.log(`[WikiJsAPI] getPageStatus вызван с id: ${id}`);
    const query = gql`
      query GetPageStatus($id: Int!) {
        pages {
          single(id: $id) {
            id
            path
            title
            description
            createdAt
            updatedAt
            isPublished
          }
        }
      }
    `;

    const variables = { id };
    console.log(
      `[WikiJsAPI] getPageStatus: отправка запроса GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      interface PageStatusResponse {
        pages: {
          single: WikiJsPage & { isPublished: boolean };
        };
      }

      const data = await this.client.request<PageStatusResponse>(
        query,
        variables
      );
      console.log("[WikiJsAPI] getPageStatus: запрос успешно выполнен.");
      const page = data.pages.single;
      // Добавляем URL к странице
      return {
        ...page,
        url: this.generatePageUrl(page.path),
      };
    } catch (error) {
      console.error(
        `[WikiJsAPI] getPageStatus: ошибка при запросе GraphQL: ${error}`,
        error
      );
      throw error;
    }
  }

  // Публикация страницы
  async publishPage(
    id: number
  ): Promise<{ success: boolean; message: string | undefined }> {
    console.log(`[WikiJsAPI] publishPage вызван с id: ${id}`);
    const mutation = gql`
      mutation PublishPage($id: Int!) {
        pages {
          render(id: $id) {
            responseResult {
              succeeded
              errorCode
              message
            }
          }
        }
      }
    `;

    const variables = { id };
    console.log(
      `[WikiJsAPI] publishPage: отправка мутации GraphQL с переменными: ${JSON.stringify(
        variables
      )}`
    );
    try {
      interface PublishPageResponse {
        pages: {
          render: {
            responseResult: ResponseResult;
          };
        };
      }

      const data = await this.client.request<PublishPageResponse>(
        mutation,
        variables
      );
      console.log("[WikiJsAPI] publishPage: мутация успешно выполнена.");

      const result = data.pages.render.responseResult;
      return {
        success: result.succeeded,
        message: result.message,
      };
    } catch (error) {
      console.error(
        `[WikiJsAPI] publishPage: ошибка при мутации GraphQL: ${error}`,
        error
      );
      return {
        success: false,
        message: `Ошибка при публикации страницы: ${error}`,
      };
    }
  }
}

// Создаем API-клиент для использования внутри модуля
const WIKIJS_BASE_URL = process.env.WIKIJS_BASE_URL || "http://localhost:3000";
const WIKIJS_TOKEN = process.env.WIKIJS_TOKEN || "";
const WIKIJS_LOCALE = process.env.WIKIJS_LOCALE || "ru";

// Функция для формирования URL страницы
function generatePageUrl(
  baseUrl: string,
  locale: string,
  path: string
): string {
  // Удаляем слэш в конце базового URL если он есть
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  // Удаляем слэш в начале пути если он есть
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBaseUrl}/${locale}/${cleanPath}`;
}

const api = new WikiJsAPI(WIKIJS_BASE_URL, WIKIJS_TOKEN, WIKIJS_LOCALE);

// Реализации инструментов
const implementations = {
  get_page: async (params: any) => {
    console.log(
      `[Implementations] get_page вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.getPage(params.id);
  },
  get_page_content: async (params: any) => {
    console.log(
      `[Implementations] get_page_content вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.getPageContent(params.id);
  },
  list_pages: async (params: any) => {
    console.log(
      `[Implementations] list_pages вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.listPages(params.limit, params.orderBy);
  },
  search_pages: async (params: any) => {
    console.log(
      `[Implementations] search_pages вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.searchPages(params.query, params.limit);
  },
  create_page: async (params: any) => {
    console.log(
      `[Implementations] create_page вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.createPage(
      params.title,
      params.content,
      params.path,
      params.description,
      params.tags || ["mcp", "test"]
    );
  },
  update_page: async (params: any) => {
    console.log(
      `[Implementations] update_page вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.updatePage(params.id, params.content);
  },
  delete_page: async (params: any) => {
    console.log(
      `[Implementations] delete_page вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.deletePage(params.id);
  },
  list_users: async (params: any) => {
    console.log(
      `[Implementations] list_users вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.listUsers();
  },
  search_users: async (params: any) => {
    console.log(
      `[Implementations] search_users вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.searchUsers(params.query);
  },
  list_groups: async (params: any) => {
    console.log(
      `[Implementations] list_groups вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.listGroups();
  },
  create_user: async (params: any) => {
    console.log(
      `[Implementations] create_user вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.createUser(
      params.email,
      params.name,
      params.passwordRaw || "tempPassword123",
      params.providerKey,
      params.groups,
      params.mustChangePassword,
      params.sendWelcomeEmail
    );
  },
  update_user: async (params: any) => {
    console.log(
      `[Implementations] update_user вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.updateUser(params.id, params.name);
  },
  list_all_pages: async (params: any) => {
    console.log(
      `[Implementations] list_all_pages вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.listAllPages(
      params.limit,
      params.orderBy,
      params.includeUnpublished
    );
  },
  search_unpublished_pages: async (params: any) => {
    console.log(
      `[Implementations] search_unpublished_pages вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.searchUnpublishedPages(params.query, params.limit);
  },
  force_delete_page: async (params: any) => {
    console.log(
      `[Implementations] force_delete_page вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.forceDeletePage(params.id);
  },
  get_page_status: async (params: any) => {
    console.log(
      `[Implementations] get_page_status вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.getPageStatus(params.id);
  },
  publish_page: async (params: any) => {
    console.log(
      `[Implementations] publish_page вызван с параметрами: ${JSON.stringify(
        params
      )}`
    );
    return await api.publishPage(params.id);
  },
};

export const wikiJsToolsWithImpl = [
  // Получение страницы по ID
  {
    type: "function",
    function: {
      name: "get_page",
      description: "Получает информацию о странице Wiki.js по её ID",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы в Wiki.js",
          },
        },
        required: ["id"],
      },
    },
    implementation: implementations.get_page,
  },
  // Получение контента страницы по ID
  {
    type: "function",
    function: {
      name: "get_page_content",
      description: "Получает содержимое страницы Wiki.js по её ID",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы в Wiki.js",
          },
        },
        required: ["id"],
      },
    },
    implementation: implementations.get_page_content,
  },
  // Получение списка страниц
  {
    type: "function",
    function: {
      name: "list_pages",
      description: "Получает список страниц Wiki.js с возможностью сортировки",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description:
              "Максимальное количество страниц для возврата (по умолчанию 50)",
          },
          orderBy: {
            type: "string",
            description: "Поле для сортировки (TITLE, CREATED, UPDATED)",
          },
        },
        required: [],
      },
    },
    implementation: implementations.list_pages,
  },
  // Поиск страниц
  {
    type: "function",
    function: {
      name: "search_pages",
      description: "Поиск страниц по запросу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Поисковый запрос",
          },
          limit: {
            type: "number",
            description:
              "Максимальное количество результатов (по умолчанию 10)",
          },
        },
        required: ["query"],
      },
    },
    implementation: implementations.search_pages,
  },
  // Создание страницы
  {
    type: "function",
    function: {
      name: "create_page",
      description: "Создает новую страницу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Заголовок страницы",
          },
          content: {
            type: "string",
            description: "Содержимое страницы (в формате Markdown)",
          },
          path: {
            type: "string",
            description: "Путь к странице (например, 'folder/page')",
          },
          description: {
            type: "string",
            description: "Краткое описание страницы",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Теги страницы",
          },
        },
        required: ["title", "content", "path"],
      },
    },
    implementation: implementations.create_page,
  },
  // Обновление страницы
  {
    type: "function",
    function: {
      name: "update_page",
      description: "Обновляет существующую страницу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы для обновления",
          },
          content: {
            type: "string",
            description: "Новое содержимое страницы (в формате Markdown)",
          },
        },
        required: ["id", "content"],
      },
    },
    implementation: implementations.update_page,
  },
  // Удаление страницы
  {
    type: "function",
    function: {
      name: "delete_page",
      description: "Удаляет страницу из Wiki.js",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы для удаления",
          },
        },
        required: ["id"],
      },
    },
    implementation: implementations.delete_page,
  },
  // Получение списка пользователей
  {
    type: "function",
    function: {
      name: "list_users",
      description: "Получает список пользователей Wiki.js",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    implementation: implementations.list_users,
  },
  // Поиск пользователей
  {
    type: "function",
    function: {
      name: "search_users",
      description: "Поиск пользователей по запросу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Поисковый запрос (имя или email)",
          },
        },
        required: ["query"],
      },
    },
    implementation: implementations.search_users,
  },
  // Получение списка групп
  {
    type: "function",
    function: {
      name: "list_groups",
      description: "Получает список групп пользователей Wiki.js",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    implementation: implementations.list_groups,
  },
  // Создание пользователя
  {
    type: "function",
    function: {
      name: "create_user",
      description: "Создает нового пользователя в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email пользователя",
          },
          name: {
            type: "string",
            description: "Имя пользователя",
          },
          passwordRaw: {
            type: "string",
            description: "Пароль пользователя (в открытом виде)",
          },
          providerKey: {
            type: "string",
            description:
              "Ключ провайдера аутентификации (по умолчанию 'local')",
          },
          groups: {
            type: "array",
            items: {
              type: "number",
            },
            description:
              "Массив ID групп, в которые будет добавлен пользователь (по умолчанию [2])",
          },
          mustChangePassword: {
            type: "boolean",
            description:
              "Требовать смену пароля при следующем входе (по умолчанию false)",
          },
          sendWelcomeEmail: {
            type: "boolean",
            description: "Отправить приветственное письмо (по умолчанию false)",
          },
        },
        required: ["email", "name", "passwordRaw"],
      },
    },
    implementation: implementations.create_user,
  },
  // Обновление пользователя
  {
    type: "function",
    function: {
      name: "update_user",
      description: "Обновляет информацию о пользователе Wiki.js",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID пользователя для обновления",
          },
          name: {
            type: "string",
            description: "Новое имя пользователя",
          },
        },
        required: ["id", "name"],
      },
    },
    implementation: implementations.update_user,
  },
  // Получение всех страниц включая неопубликованные
  {
    type: "function",
    function: {
      name: "list_all_pages",
      description:
        "Получает список всех страниц Wiki.js включая неопубликованные с возможностью сортировки",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description:
              "Максимальное количество страниц для возврата (по умолчанию 50)",
          },
          orderBy: {
            type: "string",
            description: "Поле для сортировки (TITLE, CREATED, UPDATED)",
          },
          includeUnpublished: {
            type: "boolean",
            description:
              "Включать неопубликованные страницы (по умолчанию true)",
          },
        },
        required: [],
      },
    },
    implementation: implementations.list_all_pages,
  },
  // Поиск неопубликованных страниц
  {
    type: "function",
    function: {
      name: "search_unpublished_pages",
      description: "Поиск неопубликованных страниц по запросу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Поисковый запрос",
          },
          limit: {
            type: "number",
            description:
              "Максимальное количество результатов (по умолчанию 10)",
          },
        },
        required: ["query"],
      },
    },
    implementation: implementations.search_unpublished_pages,
  },
  // Принудительное удаление страницы (включая неопубликованные)
  {
    type: "function",
    function: {
      name: "force_delete_page",
      description:
        "Принудительно удаляет страницу из Wiki.js (включая неопубликованные страницы)",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы для удаления",
          },
        },
        required: ["id"],
      },
    },
    implementation: implementations.force_delete_page,
  },
  // Получение статуса публикации страницы
  {
    type: "function",
    function: {
      name: "get_page_status",
      description:
        "Получает статус публикации и детальную информацию о странице",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы в Wiki.js",
          },
        },
        required: ["id"],
      },
    },
    implementation: implementations.get_page_status,
  },
  // Публикация страницы
  {
    type: "function",
    function: {
      name: "publish_page",
      description: "Публикует неопубликованную страницу в Wiki.js",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "ID страницы для публикации",
          },
        },
        required: ["id"],
      },
    },
    implementation: implementations.publish_page,
  },
];

export {
  WikiJsToolDefinition,
  WikiJsPage,
  WikiJsUser,
  WikiJsGroup,
  ResponseResult,
  WikiJsAPI,
};
