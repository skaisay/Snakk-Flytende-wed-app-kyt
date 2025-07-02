/**
 * ЕДИНАЯ БАЗА ДАННЫХ ДЛЯ НОРВЕЖСКОГО АССИСТЕНТА
 * Все данные в одном файле для простого редактирования
 */

const NORWEGIAN_DATABASE = {
    
    // ================================================
    // ПЕРЕВОДЫ С РУССКОГО НА НОРВЕЖСКИЙ
    // ================================================
    translations: {
        "привет": "hei",
        "спасибо": "takk",
        "пожалуйста": "tusen takk",
        "извините": "unnskyld",
        "до свидания": "ha det",
        "доброе утро": "god morgen",
        "добрый день": "god dag",
        "добрая ночь": "god natt",
        "как дела?": "hvordan har du det?",
        "как тебя зовут?": "hva heter du?",
        "меня зовут": "jeg heter",
        "я не понимаю": "jeg forstår ikke",
        "говорите медленнее": "snakk saktere",
        "где туалет?": "hvor er toalettet?",
        "сколько это стоит?": "hvor mye koster det?",
        "я хочу": "jeg vil ha",
        "тест_изменение": "ЕДИНАЯ_БАЗА_РАБОТАЕТ_ИДЕАЛЬНО",
        "мне нужно": "jeg trenger",
        "помогите": "hjelp",
        "вода": "vann",
        "еда": "mat",
        "дом": "hus",
        "работа": "arbeid",
        "семья": "familie",
        "друг": "venn",
        "время": "tid",
        "день": "dag",
        "ночь": "natt",
        "красивый": "vakker",
        "хороший": "bra",
        "плохой": "dårlig",
        "большой": "stor",
        "маленький": "liten"
    },
    
    // ================================================
    // РАЗГОВОРНЫЕ ФРАЗЫ ДЛЯ ОБЩЕНИЯ
    // ================================================
    conversations: {
        greetings: [
            "Привет! Я помогаю изучать норвежскийdddddddd язык.",
            "Здравствуйте! Чем могу помочь в изуddddddddddddddчении норвежского?",
            "Привет! Готов помочь с переводdddddddddами и новыми словами."
        ],
        
        help: [
            "Я могу переводить слова с русского на норвежский.",
            "Спросите меня любое слово или фразу для перевода.",
            "Могу дать случайное норвежское слово для изучения.",
            "Помогу с базовой норвежской лексикой."
        ],
        
        thanks: [
            "Пожалуйста! Всегда рад помочь с норвежским.",
            "Не за что! Продолжайте изучать норвежский!",
            "Рад помочь! Спрашивайте еще."
        ],
        
        unknown: [
            "Извините, не нашел перевод этого слова.",
            "Этого слова пока нет в моей базе.",
            "Попробуйте другое слово или фразу.",
            "База данных пополняется, попробуйте позже."
        ],
        
        // Новые категории для диалога
        positive: [
            "Отлично! Что еще хотите изучить?",
            "Замечательно! Давайте продолжим изучение.",
            "Супер! Готов помочь с новыми словами.",
            "Прекрасно! Спрашивайте еще."
        ],
        
        negative: [
            "Понятно. Попробуем что-то другое?",
            "Хорошо, давайте найдем другой подход.",
            "Ничего страшного. Что вас больше интересует?",
            "Попробуем по-другому. О чем хотите узнать?"
        ],
        
        alternative: [
            "Хорошо, давайте попробуем другой вариант. Что вас интересует?",
            "Конечно! Могу предложить что-то другое.",
            "Без проблем. Что еще хотели бы изучить?",
            "Давайте найдем альтернативу. Какая тема вас интересует?"
        ],
        
        uncertain: [
            "Не уверены? Могу предложить несколько вариантов для изучения.",
            "Понимаю. Давайте начнем с простых слов?",
            "Ничего страшного. Можем изучать постепенно.",
            "Не переживайте. Начнем с базовых фраз?"
        ],
        
        farewell: [
            "До свидания! Удачи в изучении норвежского!",
            "Пока! Возвращайтесь для новых слов.",
            "До встречи! Практикуйте норвежский каждый день.",
            "Увидимся! Успехов в изучении языка."
        ]
    },
    
    // ================================================
    // НОРВЕЖСКАЯ ЛЕКСИКА ПО КАТЕГОРИЯМ
    // ================================================
    vocabulary: {
        basic: {
            "jeg": "я",
            "du": "ты",
            "han": "он", 
            "hun": "она",
            "vi": "мы",
            "dere": "вы",
            "de": "они"
        },
        
        family: {
            "mor": "мать",
            "far": "отец",
            "sønn": "сын",
            "datter": "дочь",
            "bror": "брат",
            "søster": "сестра"
        },
        
        numbers: {
            "en": "один",
            "to": "два", 
            "tre": "три",
            "fire": "четыре",
            "fem": "пять",
            "seks": "шесть",
            "syv": "семь",
            "åtte": "восемь",
            "ni": "девять",
            "ti": "десять"
        }
    }
};

/**
 * Главная функция поиска в базе данных
 */
function searchInDatabase(query) {
    const lowerQuery = query.toLowerCase().trim();
    
    console.log('🔍 Ищу в единой базе:', lowerQuery);
    
    // === ДИАЛОГОВАЯ ЛОГИКА В ОДНОМ ФАЙЛЕ ===
    // Положительные ответы (да, хорошо, согласен)
    if (lowerQuery.includes('да') || lowerQuery.includes('конечно') || lowerQuery.includes('хорошо') || 
        lowerQuery.includes('отлично') || lowerQuery.includes('согласен') || lowerQuery.includes('согласна') || 
        lowerQuery.includes('ок') || lowerQuery.includes('окей') || lowerQuery.includes('давайте') || 
        lowerQuery.includes('пойдет') || lowerQuery.includes('супер') || lowerQuery.includes('класс') || 
        lowerQuery.includes('круто')) {
        return getConversationResponse('positive') || 'Отлично! Что еще хотите изучить?';
    }

    // Отрицательные ответы (нет, не хочу, не то)  
    if (lowerQuery.includes('нет') || lowerQuery.includes('не хочу') || lowerQuery.includes('не надо') || 
        lowerQuery.includes('не нужно') || lowerQuery.includes('не то') || lowerQuery.includes('неправильно') || 
        lowerQuery.includes('не подходит') || lowerQuery.includes('плохо')) {
        return getConversationResponse('negative') || 'Понятно. Попробуем что-то другое?';
    }

    // Запрос альтернативы (другое, что-то другое)
    if (lowerQuery.includes('другое') || lowerQuery.includes('что-то другое') || lowerQuery.includes('по-другому') || 
        lowerQuery.includes('еще') || lowerQuery.includes('альтернатива') || lowerQuery.includes('вариант') || 
        lowerQuery.includes('что еще')) {
        return getConversationResponse('alternative') || 'Хорошо, давайте попробуем другой вариант. Что вас интересует?';
    }

    // Неопределенные ответы (не знаю, может быть)
    if (lowerQuery.includes('не знаю') || lowerQuery.includes('может быть') || lowerQuery.includes('возможно') || 
        lowerQuery.includes('не уверен') || lowerQuery.includes('не уверена') || lowerQuery.includes('сомневаюсь') || 
        lowerQuery.includes('хм') || lowerQuery.includes('эм')) {
        return getConversationResponse('uncertain') || 'Не уверены? Могу предложить несколько вариантов для изучения.';
    }
    
    // === ПОИСК ПЕРЕВОДОВ ===
    // 1. Поиск прямого перевода
    if (NORWEGIAN_DATABASE.translations[lowerQuery]) {
        const translation = NORWEGIAN_DATABASE.translations[lowerQuery];
        console.log('✅ Найден перевод:', translation);
        return `🇷🇺 **${lowerQuery}** → 🇳🇴 **${translation}**`;
    }
    
    // 2. Поиск частичного совпадения в переводах
    for (const [russian, norwegian] of Object.entries(NORWEGIAN_DATABASE.translations)) {
        if (russian.includes(lowerQuery) || lowerQuery.includes(russian)) {
            console.log('✅ Найдено частичное совпадение:', norwegian);
            return `🇷🇺 **${russian}** → 🇳🇴 **${norwegian}**`;
        }
    }
    
    // 3. Поиск в словаре (норвежский → русский)
    for (const category of Object.values(NORWEGIAN_DATABASE.vocabulary)) {
        for (const [norwegian, russian] of Object.entries(category)) {
            if (norwegian.toLowerCase() === lowerQuery) {
                console.log('✅ Найдено в словаре:', russian);
                return `🇳🇴 **${norwegian}** → 🇷🇺 **${russian}**`;
            }
        }
    }
    
    console.log('❌ Ничего не найдено');
    return null;
}

/**
 * Получить случайное норвежское слово
 */
function getRandomWord() {
    const translations = Object.entries(NORWEGIAN_DATABASE.translations);
    const randomPair = translations[Math.floor(Math.random() * translations.length)];
    return `🇳🇴 **${randomPair[1]}** — ${randomPair[0]}\n\n💡 Попробуйте использовать это слово в предложении!`;
}

/**
 * Получить разговорную фразу
 */
function getConversationResponse(type) {
    const responses = NORWEGIAN_DATABASE.conversations[type];
    if (responses && responses.length > 0) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    return null;
}

console.log('✅ Единая база данных загружена:', Object.keys(NORWEGIAN_DATABASE.translations).length, 'переводов');
