# Норвежский языковой ассистент

## Обзор проекта

Простое веб-приложение для изучения норвежского языка с поддержкой PWA. Включает переводы, разговорные фразы и интерактивный чат-интерфейс.

## Структура файлов

### Основные файлы
- `index.html` - главная страница приложения
- `styles.css` - стили интерфейса (glassmorphism дизайн)
- `script.js` - основная логика приложения
- `database.js` - единая база данных с переводами и фразами

### PWA файлы
- `manifest.json` - конфигурация PWA
- `sw.js` - Service Worker для оффлайн работы
- `icon.svg` - иконка приложения

### Вспомогательные файлы
- `clear-cache.html` - очистка кеша браузера
- `debug.html` - отладка базы данных

## Архитектура

### Мега-система баз данных
- `database.js` - основная база данных с базовыми переводами
- `mega-database-system.js` - система управления множественными базами данных
- `norwegian-verbs.json` - дополнительная база с глаголами
- `norwegian-phrases.json` - дополнительная база с фразами

### Возможности мега-системы
- Поддержка до 100 ГБ данных
- Автоматическое индексирование для быстрого поиска
- Кеширование результатов
- Модульное подключение дополнительных баз
- Совместимость со старыми функциями

### Функции
- `searchInDatabase(query)` - поиск в базе данных (работает со всеми базами)
- `getRandomWord()` - случайное норвежское слово (из всех баз)
- `getConversationResponse(type)` - получение фразы для чата (из всех баз)
- `getSystemStats()` - статистика всех загруженных баз данных

## Как редактировать

Для добавления новых данных редактируйте только файл `database.js`:

```javascript
// Добавить новый перевод
"новое слово": "nytt ord",

// Добавить разговорную фразу
conversations: {
    greetings: ["Новое приветствие"]
}
```

## Развертывание

### GitHub Pages
1. Загрузите все файлы в репозиторий
2. Активируйте GitHub Pages
3. Приложение будет доступно как PWA

### Локальный запуск
```bash
python -m http.server 5000
```

## Пользовательские предпочтения

- Простой язык без технических терминов
- Минимальная структура файлов
- Один файл для всех данных

## Последние изменения

- July 02, 2025: Создана мега-система баз данных для поддержки до 100 ГБ данных
- July 02, 2025: Добавлена модульная архитектура с дополнительными базами данных
- July 02, 2025: Реализованы оптимизации: индексирование, кеширование, асинхронная загрузка
- July 02, 2025: Исправлены проблемы с боковым меню и контекстным меню
- July 02, 2025: Добавлен эффект подсветки сообщений как в Телеграм
- July 02, 2025: Система готова для масштабирования на GitHub Pages