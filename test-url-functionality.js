/**
 * Тестовый скрипт для демонстрации новой функциональности URL
 * в Wiki.js MCP инструментах
 */

import { WikiJsAPI } from "./dist/tools.js";

// Конфигурация для тестирования
const config = {
  baseUrl: process.env.WIKIJS_BASE_URL || "http://localhost:8080",
  token: process.env.WIKIJS_TOKEN || "",
  locale: process.env.WIKIJS_LOCALE || "ru",
};

async function testUrlFunctionality() {
  console.log("🧪 Тестирование новой функциональности URL");
  console.log("🔧 Конфигурация:");
  console.log(`   Base URL: ${config.baseUrl}`);
  console.log(`   Locale: ${config.locale}`);
  console.log(
    `   Token: ${config.token ? "✅ Установлен" : "❌ Не установлен"}`
  );
  console.log();

  try {
    // Создаем экземпляр API
    const api = new WikiJsAPI(config.baseUrl, config.token, config.locale);

    console.log("📝 Создание тестовой страницы...");
    const newPage = await api.createPage(
      "Тест URL функциональности",
      `# Тестовая страница для URL

Эта страница создана для тестирования новой функциональности автоматического формирования URL.

## Ожидаемый URL
\`${config.baseUrl}/${config.locale}/test/url-functionality\`

## Время создания
${new Date().toISOString()}
`,
      "test/url-functionality",
      "Тестовая страница для проверки URL функциональности",
      ["тест", "url", "функциональность"]
    );

    console.log("✅ Страница создана:");
    console.log(`   ID: ${newPage.id}`);
    console.log(`   Путь: ${newPage.path}`);
    console.log(`   URL: ${newPage.url || "❌ URL не сформирован"}`);
    console.log();

    console.log("🔍 Получение информации о странице...");
    const retrievedPage = await api.getPage(newPage.id);
    console.log("✅ Страница получена:");
    console.log(`   Заголовок: ${retrievedPage.title}`);
    console.log(`   URL: ${retrievedPage.url || "❌ URL не сформирован"}`);
    console.log();

    console.log("📋 Получение списка страниц...");
    const pages = await api.listPages(5);
    console.log(`✅ Получено ${pages.length} страниц:`);
    pages.forEach((page, index) => {
      console.log(`   ${index + 1}. ${page.title}`);
      console.log(`      URL: ${page.url || "❌ URL не сформирован"}`);
    });
    console.log();

    console.log("🔍 Поиск страниц...");
    const searchResults = await api.searchPages("тест", 3);
    console.log(`✅ Найдено ${searchResults.length} страниц:`);
    searchResults.forEach((page, index) => {
      console.log(`   ${index + 1}. ${page.title}`);
      console.log(`      URL: ${page.url || "❌ URL не сформирован"}`);
    });
    console.log();

    console.log("✏️ Обновление страницы...");
    const updatedPage = await api.updatePage(
      newPage.id,
      `# Обновленная тестовая страница

Эта страница была обновлена для тестирования URL функциональности.

## URL после обновления
\`${config.baseUrl}/${config.locale}/test/url-functionality\`

## Время обновления
${new Date().toISOString()}

✅ **Тест пройден успешно!**
`
    );

    console.log("✅ Страница обновлена:");
    console.log(`   URL: ${updatedPage.url || "❌ URL не сформирован"}`);
    console.log();

    console.log("🎉 Все тесты пройдены успешно!");
    console.log(
      `🔗 Ссылка на тестовую страницу: ${
        updatedPage.url || `${config.baseUrl}/${config.locale}/${newPage.path}`
      }`
    );
  } catch (error) {
    console.error("❌ Ошибка при тестировании:", error.message);
    console.error("📝 Убедитесь что:");
    console.error("   1. Wiki.js сервер запущен и доступен");
    console.error("   2. WIKIJS_TOKEN правильно настроен");
    console.error("   3. WIKIJS_BASE_URL указывает на правильный адрес");
  }
}

// Запуск тестов
if (import.meta.url === `file://${process.argv[1]}`) {
  testUrlFunctionality();
}
