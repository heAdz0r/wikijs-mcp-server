// Типы для Wiki.js GraphQL API

// Типы инструментов, которые будет предоставлять MCP
export interface WikiJsToolDefinition {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, any>;
      required: string[];
    };
  };
}

// Типы для страниц Wiki.js
export interface WikiJsPage {
  id: number;
  path: string;
  title: string;
  description?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Тип для пользователей Wiki.js
export interface WikiJsUser {
  id: number;
  name: string;
  email: string;
  providerKey: string;
  isSystem?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Тип для групп Wiki.js
export interface WikiJsGroup {
  id: number;
  name: string;
  isSystem?: boolean;
}

// Тип ответа для мутаций
export interface ResponseResult {
  succeeded: boolean;
  errorCode?: number;
  slug?: string;
  message?: string;
}

// Типы для конфигурации MCP сервера
export interface ServerConfig {
  port: number;
  wikijs: {
    baseUrl: string;
    token: string;
  };
}
