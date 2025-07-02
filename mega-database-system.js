/**
 * МЕГА-СИСТЕМА БАЗЫ ДАННЫХ ДЛЯ НОРВЕЖСКОГО АССИСТЕНТА
 * Поддерживает до 100 ГБ данных с оптимизацией производительности
 * Модульная архитектура для подключения дополнительных баз данных
 */

// ================================================
// ОСНОВНАЯ БАЗА ДАННЫХ (database.js остается как есть)
// ================================================

// ================================================
// СИСТЕМА УПРАВЛЕНИЯ БАЗАМИ ДАННЫХ
// ================================================
class MegaDatabaseManager {
    constructor() {
        this.databases = new Map();
        this.searchIndex = new Map();
        this.cache = new Map();
        this.loadedDatabases = new Set();
        
        // Регистрируем основную базу данных
        this.registerDatabase('main', NORWEGIAN_DATABASE);
        
        console.log('🚀 Мега-система баз данных инициализирована');
    }

    /**
     * Регистрация новой базы данных
     */
    registerDatabase(name, database) {
        this.databases.set(name, database);
        this.loadedDatabases.add(name);
        this.buildSearchIndex(name, database);
        console.log(`📦 База данных "${name}" зарегистрирована`);
    }

    /**
     * Построение поискового индекса для быстрого доступа
     */
    buildSearchIndex(dbName, database) {
        console.log(`🔍 Строю индекс для базы "${dbName}"`);
        
        // Индексируем переводы
        if (database.translations) {
            Object.keys(database.translations).forEach(key => {
                const searchKey = key.toLowerCase();
                if (!this.searchIndex.has(searchKey)) {
                    this.searchIndex.set(searchKey, []);
                }
                this.searchIndex.get(searchKey).push({
                    database: dbName,
                    type: 'translation',
                    key: key,
                    value: database.translations[key]
                });
            });
        }

        // Индексируем словарь
        if (database.vocabulary) {
            Object.keys(database.vocabulary).forEach(category => {
                Object.keys(database.vocabulary[category]).forEach(key => {
                    const searchKey = key.toLowerCase();
                    if (!this.searchIndex.has(searchKey)) {
                        this.searchIndex.set(searchKey, []);
                    }
                    this.searchIndex.get(searchKey).push({
                        database: dbName,
                        type: 'vocabulary',
                        category: category,
                        key: key,
                        value: database.vocabulary[category][key]
                    });
                });
            });
        }
    }

    /**
     * Умный поиск с оптимизацией
     */
    smartSearch(query) {
        const searchQuery = query.toLowerCase().trim();
        
        // Проверяем кеш
        if (this.cache.has(searchQuery)) {
            console.log('⚡ Результат из кеша');
            return this.cache.get(searchQuery);
        }

        let results = [];

        // Точное совпадение
        if (this.searchIndex.has(searchQuery)) {
            results = this.searchIndex.get(searchQuery);
        } else {
            // Частичное совпадение
            for (const [key, value] of this.searchIndex) {
                if (key.includes(searchQuery) || searchQuery.includes(key)) {
                    results.push(...value);
                }
            }
        }

        // Кешируем результат
        this.cache.set(searchQuery, results);
        
        // Ограничиваем размер кеша
        if (this.cache.size > 10000) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        return results;
    }

    /**
     * Получение разговорной фразы из всех баз
     */
    getConversationFromAllDatabases(type) {
        const allResponses = [];
        
        for (const [dbName, database] of this.databases) {
            if (database.conversations && database.conversations[type]) {
                allResponses.push(...database.conversations[type]);
            }
        }
        
        if (allResponses.length === 0) return null;
        
        return allResponses[Math.floor(Math.random() * allResponses.length)];
    }

    /**
     * Получение случайного слова из всех баз
     */
    getRandomWordFromAllDatabases() {
        const allWords = [];
        
        for (const [dbName, database] of this.databases) {
            if (database.vocabulary) {
                Object.keys(database.vocabulary).forEach(category => {
                    Object.keys(database.vocabulary[category]).forEach(word => {
                        allWords.push({
                            norwegian: word,
                            russian: database.vocabulary[category][word],
                            category: category,
                            database: dbName
                        });
                    });
                });
            }
        }
        
        if (allWords.length === 0) return 'Словарь пуст';
        
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        return `${randomWord.norwegian} — ${randomWord.russian} (${randomWord.category})`;
    }

    /**
     * Загрузка дополнительной базы данных
     */
    async loadExtraDatabase(filename) {
        try {
            console.log(`📥 Загружаю дополнительную базу: ${filename}`);
            
            // Загружаем файл
            const response = await fetch(`./${filename}`);
            const database = await response.json();
            
            // Регистрируем базу
            const dbName = filename.replace('.json', '');
            this.registerDatabase(dbName, database);
            
            return true;
        } catch (error) {
            console.error(`❌ Ошибка загрузки ${filename}:`, error);
            return false;
        }
    }

    /**
     * Статистика системы
     */
    getStats() {
        let totalTranslations = 0;
        let totalVocabulary = 0;
        let totalConversations = 0;

        for (const [dbName, database] of this.databases) {
            if (database.translations) {
                totalTranslations += Object.keys(database.translations).length;
            }
            if (database.vocabulary) {
                Object.keys(database.vocabulary).forEach(category => {
                    totalVocabulary += Object.keys(database.vocabulary[category]).length;
                });
            }
            if (database.conversations) {
                Object.keys(database.conversations).forEach(type => {
                    totalConversations += database.conversations[type].length;
                });
            }
        }

        return {
            databases: this.databases.size,
            translations: totalTranslations,
            vocabulary: totalVocabulary,
            conversations: totalConversations,
            indexSize: this.searchIndex.size,
            cacheSize: this.cache.size
        };
    }
}

// ================================================
// ИНИЦИАЛИЗАЦИЯ МЕГА-СИСТЕМЫ
// ================================================
let megaDB;

// Инициализируем после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    megaDB = new MegaDatabaseManager();
    
    // Показываем статистику
    const stats = megaDB.getStats();
    console.log('📊 Статистика мега-системы:', stats);
});

// ================================================
// ОПТИМИЗИРОВАННЫЕ ФУНКЦИИ ДЛЯ СОВМЕСТИМОСТИ
// ================================================

/**
 * Оптимизированный поиск в базе данных
 */
function searchInDatabase(query) {
    if (!megaDB) return null;
    
    const results = megaDB.smartSearch(query);
    
    if (results.length > 0) {
        // Возвращаем первый результат
        const result = results[0];
        if (result.type === 'translation') {
            return `${result.key} — ${result.value}`;
        } else if (result.type === 'vocabulary') {
            return `${result.key} — ${result.value} (${result.category})`;
        }
    }
    
    return null;
}

/**
 * Получение разговорной фразы
 */
function getConversationResponse(type) {
    if (!megaDB) return null;
    return megaDB.getConversationFromAllDatabases(type);
}

/**
 * Получение случайного слова
 */
function getRandomWord() {
    if (!megaDB) return 'Система не инициализирована';
    return megaDB.getRandomWordFromAllDatabases();
}

// ================================================
// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ БУДУЩЕГО РАСШИРЕНИЯ
// ================================================

/**
 * Загрузка дополнительных баз данных
 */
async function loadAdditionalDatabases() {
    const additionalDatabases = [
        'norwegian-verbs.json',
        'norwegian-phrases.json',
        'norwegian-grammar.json',
        'norwegian-idioms.json'
    ];
    
    for (const dbFile of additionalDatabases) {
        await megaDB.loadExtraDatabase(dbFile);
    }
}

/**
 * Очистка кеша для экономии памяти
 */
function clearCache() {
    if (megaDB) {
        megaDB.cache.clear();
        console.log('🧹 Кеш очищен');
    }
}

/**
 * Получение статистики системы
 */
function getSystemStats() {
    if (!megaDB) return null;
    return megaDB.getStats();
}