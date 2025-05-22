/**
 * Схемы Zod для типизации параметров и результатов MCP инструментов
 */

import { z } from "zod";

// Базовые типы

/**
 * Базовая схема для страницы Wiki.js
 */
export const WikiPageSchema = z.object({
  id: z.number().int().positive(),
  path: z.string(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Тип страницы Wiki.js
 */
export type WikiPage = z.infer<typeof WikiPageSchema>;

/**
 * Базовая схема для пользователя Wiki.js
 */
export const WikiUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string(),
  providerKey: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Тип пользователя Wiki.js
 */
export type WikiUser = z.infer<typeof WikiUserSchema>;

/**
 * Базовая схема для группы пользователей Wiki.js
 */
export const WikiGroupSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  isSystem: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Тип группы пользователей Wiki.js
 */
export type WikiGroup = z.infer<typeof WikiGroupSchema>;

// Схемы для параметров инструментов

/**
 * Схема параметров запроса страницы
 */
export const GetPageParamsSchema = z.object({
  id: z.number().int().positive().describe("ID страницы"),
});

/**
 * Схема параметров запроса содержимого страницы
 */
export const GetPageContentParamsSchema = z.object({
  id: z.number().int().positive().describe("ID страницы"),
});

/**
 * Схема параметров для получения списка страниц
 */
export const ListPagesParamsSchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Максимальное количество результатов"),
  orderBy: z
    .enum(["TITLE", "CREATED", "UPDATED"])
    .optional()
    .describe("Порядок сортировки"),
});

/**
 * Схема параметров для поиска страниц
 */
export const SearchPagesParamsSchema = z.object({
  query: z.string().min(1).describe("Поисковый запрос"),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Максимальное количество результатов"),
});

/**
 * Схема параметров для создания страницы
 */
export const CreatePageParamsSchema = z.object({
  title: z.string().min(1).describe("Заголовок страницы"),
  content: z.string().describe("Содержимое страницы в формате Markdown"),
  path: z.string().min(1).describe('Путь к странице (например, "folder/page")'),
  description: z.string().optional().describe("Описание страницы"),
});

/**
 * Схема параметров для обновления страницы
 */
export const UpdatePageParamsSchema = z.object({
  id: z.number().int().positive().describe("ID страницы"),
  content: z.string().min(1).describe("Новое содержимое страницы"),
});

/**
 * Схема параметров для удаления страницы
 */
export const DeletePageParamsSchema = z.object({
  id: z.number().int().positive().describe("ID страницы"),
});

/**
 * Схема параметров для поиска пользователей
 */
export const SearchUsersParamsSchema = z.object({
  query: z.string().min(1).describe("Поисковый запрос"),
});

/**
 * Схема параметров для создания пользователя
 */
export const CreateUserParamsSchema = z.object({
  email: z.string().email().describe("Email пользователя"),
  name: z.string().min(1).describe("Имя пользователя"),
  password: z.string().min(8).optional().describe("Пароль пользователя"),
  provider: z.string().optional().describe("Провайдер аутентификации"),
  groups: z
    .array(z.number().int().positive())
    .optional()
    .describe("ID групп пользователя"),
});

/**
 * Схема параметров для обновления пользователя
 */
export const UpdateUserParamsSchema = z.object({
  id: z.number().int().positive().describe("ID пользователя"),
  email: z.string().email().optional().describe("Email пользователя"),
  name: z.string().min(1).optional().describe("Имя пользователя"),
  isActive: z.boolean().optional().describe("Активен ли пользователь"),
  groups: z
    .array(z.number().int().positive())
    .optional()
    .describe("ID групп пользователя"),
});

// Схемы для результатов инструментов

/**
 * Схема результата запроса страницы
 */
export const GetPageResultSchema = WikiPageSchema;

/**
 * Схема результата запроса содержимого страницы
 */
export const GetPageContentResultSchema = z.string();

/**
 * Схема результата запроса списка страниц
 */
export const ListPagesResultSchema = z.array(WikiPageSchema);

/**
 * Схема результата поиска страниц
 */
export const SearchPagesResultSchema = z.array(WikiPageSchema);

/**
 * Схема результата создания страницы
 */
export const CreatePageResultSchema = WikiPageSchema;

/**
 * Схема результата обновления страницы
 */
export const UpdatePageResultSchema = WikiPageSchema;

/**
 * Схема результата удаления страницы
 */
export const DeletePageResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

/**
 * Схема результата запроса списка пользователей
 */
export const ListUsersResultSchema = z.array(WikiUserSchema);

/**
 * Схема результата поиска пользователей
 */
export const SearchUsersResultSchema = z.array(WikiUserSchema);

/**
 * Схема результата запроса списка групп
 */
export const ListGroupsResultSchema = z.array(WikiGroupSchema);

/**
 * Схема результата создания пользователя
 */
export const CreateUserResultSchema = WikiUserSchema;

/**
 * Схема результата обновления пользователя
 */
export const UpdateUserResultSchema = WikiUserSchema;

// Объединение всех схем параметров инструментов
export const ToolParamsSchemas = {
  get_page: GetPageParamsSchema,
  get_page_content: GetPageContentParamsSchema,
  list_pages: ListPagesParamsSchema,
  search_pages: SearchPagesParamsSchema,
  create_page: CreatePageParamsSchema,
  update_page: UpdatePageParamsSchema,
  delete_page: DeletePageParamsSchema,
  search_users: SearchUsersParamsSchema,
  create_user: CreateUserParamsSchema,
  update_user: UpdateUserParamsSchema,
};

// Объединение всех схем результатов инструментов
export const ToolResultSchemas = {
  get_page: GetPageResultSchema,
  get_page_content: GetPageContentResultSchema,
  list_pages: ListPagesResultSchema,
  search_pages: SearchPagesResultSchema,
  create_page: CreatePageResultSchema,
  update_page: UpdatePageResultSchema,
  delete_page: DeletePageResultSchema,
  list_users: ListUsersResultSchema,
  search_users: SearchUsersResultSchema,
  list_groups: ListGroupsResultSchema,
  create_user: CreateUserResultSchema,
  update_user: UpdateUserResultSchema,
};

/**
 * Функция для валидации параметров инструмента
 * @param toolName Имя инструмента
 * @param params Параметры для валидации
 * @returns Валидированные параметры или ошибка
 */
export function validateToolParams(toolName: string, params: any) {
  const schema = ToolParamsSchemas[toolName as keyof typeof ToolParamsSchemas];
  if (!schema) {
    throw new Error(`Схема для параметров инструмента ${toolName} не найдена`);
  }

  return schema.parse(params);
}

/**
 * Функция для валидации результата инструмента
 * @param toolName Имя инструмента
 * @param result Результат для валидации
 * @returns Валидированный результат или ошибка
 */
export function validateToolResult(toolName: string, result: any) {
  const schema = ToolResultSchemas[toolName as keyof typeof ToolResultSchemas];
  if (!schema) {
    throw new Error(`Схема для результата инструмента ${toolName} не найдена`);
  }

  return schema.parse(result);
}

/**
 * Функция для безопасной валидации параметров инструмента
 * @param toolName Имя инструмента
 * @param params Параметры для валидации
 * @returns Результат валидации (успех/ошибка)
 */
export function safeValidateToolParams(toolName: string, params: any) {
  const schema = ToolParamsSchemas[toolName as keyof typeof ToolParamsSchemas];
  if (!schema) {
    return {
      success: false,
      error: `Схема для параметров инструмента ${toolName} не найдена`,
    };
  }

  const result = schema.safeParse(params);
  return result;
}

/**
 * Функция для безопасной валидации результата инструмента
 * @param toolName Имя инструмента
 * @param result Результат для валидации
 * @returns Результат валидации (успех/ошибка)
 */
export function safeValidateToolResult(toolName: string, result: any) {
  const schema = ToolResultSchemas[toolName as keyof typeof ToolResultSchemas];
  if (!schema) {
    return {
      success: false,
      error: `Схема для результата инструмента ${toolName} не найдена`,
    };
  }

  const validationResult = schema.safeParse(result);
  return validationResult;
}
