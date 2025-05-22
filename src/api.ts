import { GraphQLClient } from "graphql-request";
import {
  WikiJsPage,
  WikiJsUser,
  WikiJsGroup,
  ResponseResult,
} from "./types.js";

// Класс для взаимодействия с Wiki.js GraphQL API
export class WikiJsApi {
  private client: GraphQLClient;

  constructor(baseUrl: string, token: string) {
    // GraphQL эндпоинт Wiki.js
    this.client = new GraphQLClient(`${baseUrl}/graphql`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Проверка соединения с Wiki.js
  async checkConnection(): Promise<boolean> {
    try {
      const query = `
        {
          pages {
            list (limit: 1) {
              title
            }
          }
        }
      `;
      const response = await this.client.request(query);
      return !!response;
    } catch (error) {
      console.error("Ошибка соединения с Wiki.js:", error);
      return false;
    }
  }

  // Получение страницы по ID
  async getPageById(id: number): Promise<WikiJsPage> {
    const query = `
      {
        pages {
          single (id: ${id}) {
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
    const response: any = await this.client.request(query);
    return response.pages.single;
  }

  // Получение контента страницы
  async getPageContent(id: number): Promise<string> {
    const query = `
      {
        pages {
          single (id: ${id}) {
            content
          }
        }
      }
    `;
    const response: any = await this.client.request(query);
    return response.pages.single.content;
  }

  // Получение списка страниц
  async getPagesList(
    limit: number = 50,
    orderBy: string = "TITLE"
  ): Promise<WikiJsPage[]> {
    const query = `
      {
        pages {
          list (limit: ${limit}, orderBy: ${orderBy}) {
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
    const response: any = await this.client.request(query);
    return response.pages.list;
  }

  // Поиск страниц
  async searchPages(query: string, limit: number = 10): Promise<WikiJsPage[]> {
    const gqlQuery = `
      {
        pages {
          search (query: "${query}", limit: ${limit}) {
            id
            path
            title
            description
          }
        }
      }
    `;
    const response: any = await this.client.request(gqlQuery);
    return response.pages.search;
  }

  // Создание новой страницы
  async createPage(
    title: string,
    content: string,
    path: string,
    description: string = ""
  ): Promise<ResponseResult> {
    const mutation = `
      mutation {
        pages {
          create (
            content: ${JSON.stringify(content)}
            description: ${JSON.stringify(description)}
            editor: "markdown"
            isPublished: true
            locale: "en"
            path: ${JSON.stringify(path)}
            title: ${JSON.stringify(title)}
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
            page {
              id
              path
              title
            }
          }
        }
      }
    `;
    const response: any = await this.client.request(mutation);
    return response.pages.create.responseResult;
  }

  // Обновление страницы
  async updatePage(id: number, content: string): Promise<ResponseResult> {
    const mutation = `
      mutation {
        pages {
          update (
            id: ${id}
            content: ${JSON.stringify(content)}
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
          }
        }
      }
    `;
    const response: any = await this.client.request(mutation);
    return response.pages.update.responseResult;
  }

  // Удаление страницы
  async deletePage(id: number): Promise<ResponseResult> {
    const mutation = `
      mutation {
        pages {
          delete (
            id: ${id}
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
          }
        }
      }
    `;
    const response: any = await this.client.request(mutation);
    return response.pages.delete.responseResult;
  }

  // Получение списка пользователей
  async getUsersList(): Promise<WikiJsUser[]> {
    const query = `
      {
        users {
          list {
            id
            name
            email
            providerKey
            isSystem
            isActive
            createdAt
            updatedAt
          }
        }
      }
    `;
    const response: any = await this.client.request(query);
    return response.users.list;
  }

  // Поиск пользователей
  async searchUsers(query: string): Promise<WikiJsUser[]> {
    const gqlQuery = `
      {
        users {
          search (query: "${query}") {
            id
            name
            email
          }
        }
      }
    `;
    const response: any = await this.client.request(gqlQuery);
    return response.users.search;
  }

  // Получение списка групп
  async getGroupsList(): Promise<WikiJsGroup[]> {
    const query = `
      {
        groups {
          list {
            id
            name
            isSystem
          }
        }
      }
    `;
    const response: any = await this.client.request(query);
    return response.groups.list;
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
  ): Promise<ResponseResult> {
    const mutation = `
      mutation {
        users {
          create (
            email: ${JSON.stringify(email)}
            name: ${JSON.stringify(name)}
            passwordRaw: ${JSON.stringify(passwordRaw)}
            providerKey: ${JSON.stringify(providerKey)}
            groups: [${groups.join(",")}]
            mustChangePassword: ${mustChangePassword}
            sendWelcomeEmail: ${sendWelcomeEmail}
          ) {
            responseResult {
              succeeded
              slug
              message
            }
            user {
              id
            }
          }
        }
      }
    `;
    const response: any = await this.client.request(mutation);
    return response.users.create.responseResult;
  }

  // Обновление пользователя
  async updateUser(id: number, name: string): Promise<ResponseResult> {
    const mutation = `
      mutation {
        users {
          update (
            id: ${id}
            name: ${JSON.stringify(name)}
          ) {
            responseResult {
              succeeded
              slug
              message
            }
          }
        }
      }
    `;
    const response: any = await this.client.request(mutation);
    return response.users.update.responseResult;
  }
}
