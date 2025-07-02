/**
 * ПРОСТОЙ СКРИПТ ДЛЯ РАБОТЫ С ЕДИНОЙ БАЗОЙ ДАННЫХ
 * Без сложных систем - только основные функции
 */

class SimpleNorwegianAssistant {
    constructor() {
        this.messageInput = null;
        this.chatMessages = null;
        this.isLoading = false;
    }

    /**
     * Инициализация приложения
     */
    async init() {
        console.log('🚀 Запуск простого норвежского ассистента');
        
        // Находим элементы (исправленные ID)
        this.messageInput = document.getElementById('messageInput');
        this.chatMessages = document.getElementById('messagesContainer');
        
        // Привязываем события
        this.bindEvents();
        
        // Инициализируем иконки
        this.initializeFeatherIcons();
        
        // Проверяем базу данных
        this.checkDatabase();
        
        console.log('✅ Ассистент готов к работе');
    }

    /**
     * Проверка загрузки базы данных
     */
    checkDatabase() {
        if (typeof NORWEGIAN_DATABASE !== 'undefined') {
            const count = Object.keys(NORWEGIAN_DATABASE.translations).length;
            console.log(`✅ База данных загружена: ${count} переводов`);
            this.updateDataStatus(`База загружена: ${count} переводов`);
            
            // Загружаем дополнительные базы данных
            setTimeout(() => {
                this.loadExtraDatabases();
            }, 2000);
            
        } else {
            console.log('❌ База данных не загружена');
            this.updateDataStatus('База данных не загружена');
        }
    }
    
    /**
     * Загрузка дополнительных баз данных
     */
    async loadExtraDatabases() {
        console.log('📦 Загружаю дополнительные базы данных...');
        
        if (typeof megaDB !== 'undefined') {
            try {
                await megaDB.loadExtraDatabase('norwegian-verbs.json');
                await megaDB.loadExtraDatabase('norwegian-phrases.json');
                
                const stats = megaDB.getStats();
                console.log('📊 Обновленная статистика:', stats);
                
                this.updateDataStatus(`Загружено ${stats.databases} баз данных, ${stats.translations} переводов`);
                
                setTimeout(() => {
                    this.hideDataStatus();
                }, 3000);
                
            } catch (error) {
                console.log('⚠️ Дополнительные базы не найдены, работаем с основной');
                setTimeout(() => {
                    this.hideDataStatus();
                }, 3000);
            }
        }
    }

    /**
     * Обновление статуса данных в заголовке
     */
    updateDataStatus(message) {
        const statusElement = document.getElementById('dataStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.style.display = 'block';
        }
    }

    /**
     * Скрытие статуса загрузки данных
     */
    hideDataStatus() {
        const statusElement = document.getElementById('dataStatus');
        if (statusElement) {
            statusElement.style.display = 'none';
        }
    }

    /**
     * Инициализация иконок Feather
     */
    initializeFeatherIcons() {
        if (typeof feather !== 'undefined') {
            feather.replace();
            console.log('✅ Иконки Feather инициализированы');
        }
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        // Отправка формы (исправленные ID)
        const inputForm = document.getElementById('inputForm');
        if (inputForm) {
            inputForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        // Автоматическое изменение высоты поля ввода
        if (this.messageInput) {
            this.messageInput.addEventListener('input', () => {
                this.adjustInputHeight();
            });
        }

        // Кнопка меню
        const menuButton = document.getElementById('menuButton');
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                this.toggleMenu();
            });
        }

        // Кнопка нового чата
        const newChatBtn = document.getElementById('newChatBtn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.startNewChat();
            });
        }

        // Закрытие бокового меню
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Кнопка источников данных
        const sourcesBtn = document.getElementById('sourcesBtn');
        if (sourcesBtn) {
            sourcesBtn.addEventListener('click', () => {
                this.showSourcesModal();
            });
        }
    }

    /**
     * Автоматическое изменение высоты поля ввода
     */
    adjustInputHeight() {
        if (this.messageInput) {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        }
    }

    /**
     * Обработка отправки сообщения
     */
    async handleSubmit() {
        if (this.isLoading) return;

        const message = this.messageInput.value.trim();
        if (!message) return;

        console.log('📝 Получено сообщение:', message);

        // Добавляем сообщение пользователя
        this.addUserMessage(message);
        
        // Обновляем заголовок чата первым сообщением (если это первое сообщение)
        if (this.chatMessages.children.length === 1) {
            this.updateChatTitle(message);
        }
        
        // Очищаем поле ввода
        this.messageInput.value = '';
        this.adjustInputHeight();

        // Показываем индикатор загрузки
        this.showLoadingIndicator();

        try {
            // Ищем ответ
            const response = await this.findAnswer(message);
            
            // Добавляем ответ ассистента
            this.addAssistantMessage(response);
            
        } catch (error) {
            console.error('❌ Ошибка:', error);
            this.addAssistantMessage('Извините, произошла ошибка. Попробуйте еще раз.');
        } finally {
            this.hideLoadingIndicator();
            this.scrollToBottom();
        }
    }

    /**
     * Поиск ответа в единой базе данных
     */
    async findAnswer(message) {
        console.log('🔍 Ищу ответ для:', message);
        console.log('📊 База данных доступна:', typeof NORWEGIAN_DATABASE !== 'undefined');
        console.log('📊 Функция searchInDatabase доступна:', typeof searchInDatabase === 'function');
        console.log('📊 Функция getConversationResponse доступна:', typeof getConversationResponse === 'function');
        
        const lowerMessage = message.toLowerCase().trim();

        // Проверка базы данных
        if (typeof NORWEGIAN_DATABASE === 'undefined') {
            return 'База данных не загружена. Перезагрузите страницу.';
        }
        
        // Проверка функций
        if (typeof searchInDatabase !== 'function') {
            return 'Функция поиска не загружена. Проверьте подключение database.js';
        }

        // === ДИАЛОГОВЫЕ ОТВЕТЫ ===
        // Все диалоговые проверки теперь в database.js через функцию searchInDatabase

        // === СТАНДАРТНЫЕ КОМАНДЫ ===

        // Приветствие
        if (lowerMessage.includes('привет') || lowerMessage.includes('здравств')) {
            return getConversationResponse('greetings') || 'Привет! Я помогаю изучать норвежский язык.';
        }

        // Помощь
        if (lowerMessage.includes('помощь') || lowerMessage.includes('помоги')) {
            return getConversationResponse('help') || 'Спросите меня любое слово для перевода или попросите случайное слово.';
        }

        // Благодарность
        if (lowerMessage.includes('спасибо') || lowerMessage.includes('благодар')) {
            return getConversationResponse('thanks') || 'Пожалуйста! Всегда рад помочь.';
        }

        // Случайное слово
        if (lowerMessage.includes('случайное слово') || lowerMessage.includes('случайное')) {
            return getRandomWord();
        }

        // Прощание
        if (lowerMessage.includes('пока') || lowerMessage.includes('до свидания')) {
            return getConversationResponse('farewell') || 'До свидания! Удачи в изучении норвежского!';
        }

        // === ПОИСК ПЕРЕВОДА ===
        const searchResult = searchInDatabase(lowerMessage);
        if (searchResult) {
            return searchResult;
        }

        // Если ничего не найдено
        return getConversationResponse('unknown') || 'Извините, не нашел перевод этого слова. Попробуйте другое слово.';
    }



    /**
     * Добавление сообщения пользователя
     */
    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.chatMessages.appendChild(messageElement);
    }

    /**
     * Добавление сообщения ассистента
     */
    addAssistantMessage(message) {
        const messageElement = this.createMessageElement(message, 'assistant');
        this.chatMessages.appendChild(messageElement);
    }

    /**
     * Создание элемента сообщения
     */
    createMessageElement(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        // Иконка
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (type === 'user') {
            avatarDiv.innerHTML = '<i data-feather="user"></i>';
        } else {
            avatarDiv.innerHTML = '<i data-feather="cpu"></i>';
        }

        // Контент
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Простое форматирование маркдауна
        const formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        contentDiv.innerHTML = formattedContent;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        // Добавляем контекстное меню для сообщений
        this.addContextMenuToMessage(messageDiv, content);

        // Инициализируем иконки
        setTimeout(() => {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }, 0);

        return messageDiv;
    }

    /**
     * Показать индикатор загрузки
     */
    showLoadingIndicator() {
        this.isLoading = true;
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message assistant-message loading-message';
        loadingDiv.id = 'loadingIndicator';
        
        loadingDiv.innerHTML = `
            <div class="message-avatar">
                <i data-feather="cpu"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(loadingDiv);
        
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        this.scrollToBottom();
    }

    /**
     * Скрыть индикатор загрузки
     */
    hideLoadingIndicator() {
        this.isLoading = false;
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    /**
     * Прокрутка к низу
     */
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    /**
     * Переключение меню
     */
    toggleMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('open');
            overlay.classList.add('open');
        }
    }

    /**
     * Закрытие бокового меню
     */
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        }
    }

    /**
     * Показать модальное окно источников
     */
    showSourcesModal() {
        alert('База данных содержит:\n- Переводы: ' + (Object.keys(NORWEGIAN_DATABASE.translations || {}).length) + ' записей\n- Разговорные фразы\n- Норвежскую лексику');
        this.closeSidebar();
    }

    /**
     * Начать новый чат
     */
    startNewChat() {
        // Очищаем сообщения
        if (this.chatMessages) {
            this.chatMessages.innerHTML = '';
        }
        
        // Обновляем заголовок
        const chatTitle = document.getElementById('chatTitle');
        if (chatTitle) {
            chatTitle.firstChild.textContent = 'Новый чат';
        }
        
        // Добавляем приветственное сообщение
        this.addAssistantMessage('Привет! Я помогаю изучать норвежский язык. Спрашивайте переводы или попросите случайное слово!');
    }

    /**
     * Добавить контекстное меню к сообщению
     */
    addContextMenuToMessage(messageElement, messageText) {
        let longPressTimer;
        let touchStarted = false;

        // Обработчики для мобильных устройств
        messageElement.addEventListener('touchstart', (e) => {
            touchStarted = true;
            // Добавляем подсветку
            messageElement.classList.add('highlighted');
            
            longPressTimer = setTimeout(() => {
                if (touchStarted) {
                    this.showContextMenu(e, messageText);
                }
            }, 600);
        });

        messageElement.addEventListener('touchend', (e) => {
            touchStarted = false;
            clearTimeout(longPressTimer);
            
            // Убираем подсветку через небольшую задержку
            setTimeout(() => {
                messageElement.classList.remove('highlighted');
            }, 150);
        });

        messageElement.addEventListener('touchmove', () => {
            touchStarted = false;
            clearTimeout(longPressTimer);
            messageElement.classList.remove('highlighted');
        });

        // Обработчик для десктопа
        messageElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            messageElement.classList.add('highlighted');
            this.showContextMenu(e, messageText);
            
            // Убираем подсветку через задержку
            setTimeout(() => {
                messageElement.classList.remove('highlighted');
            }, 2000);
        });
    }

    /**
     * Показать контекстное меню
     */
    showContextMenu(event, messageText) {
        const contextMenu = document.getElementById('contextMenu');
        if (!contextMenu) return;

        // Получаем координаты для touch или mouse события
        let x, y;
        if (event.touches && event.touches[0]) {
            x = event.touches[0].pageX;
            y = event.touches[0].pageY;
        } else {
            x = event.pageX;
            y = event.pageY;
        }

        // Позиционируем меню
        contextMenu.style.display = 'block';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';

        // Сохраняем текст для использования в функциях
        this.currentMessageText = messageText;

        // Добавляем обработчики кнопок
        const copyBtn = document.getElementById('copyMessage');
        const speakBtn = document.getElementById('speakMessage');

        if (copyBtn) {
            copyBtn.onclick = () => {
                this.copyToClipboard(this.currentMessageText);
                this.hideContextMenu();
            };
        }

        if (speakBtn) {
            speakBtn.onclick = () => {
                this.speakText(this.currentMessageText);
                this.hideContextMenu();
            };
        }

        // Скрываем меню при клике вне его
        setTimeout(() => {
            document.addEventListener('click', this.hideContextMenu.bind(this), { once: true });
        }, 100);
    }

    /**
     * Скрыть контекстное меню
     */
    hideContextMenu() {
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
        
        // Убираем подсветку со всех сообщений
        document.querySelectorAll('.message.highlighted').forEach(msg => {
            msg.classList.remove('highlighted');
        });
        
        // Принудительно включаем скролл (на случай если он заблокирован)
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overflow = '';
        
        // Очищаем все touch события которые могли остаться
        this.clearAllTouchEvents();
    }
    
    /**
     * Очистить все touch события
     */
    clearAllTouchEvents() {
        // Принудительно завершаем все активные touch события
        if (window.TouchEvent) {
            const touchEndEvent = new TouchEvent('touchend', {
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(touchEndEvent);
        }
    }

    /**
     * Копировать текст в буфер обмена
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Текст скопирован в буфер обмена');
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    }

    /**
     * Озвучить текст
     */
    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ru-RU';
            speechSynthesis.speak(utterance);
        }
    }

    /**
     * Обновить заголовок чата первым сообщением пользователя
     */
    updateChatTitle(message) {
        const chatTitle = document.getElementById('chatTitle');
        if (chatTitle && message) {
            const titleText = message.length > 30 ? message.substring(0, 30) + '...' : message;
            chatTitle.firstChild.textContent = titleText;
        }
    }
}

/**
 * Инициализация приложения после загрузки DOM
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 DOM загружен, запускаю ассистента');
    
    window.assistant = new SimpleNorwegianAssistant();
    await window.assistant.init();
    
    console.log('🎉 Приложение готово к работе');
});

/**
 * Обработка ошибок
 */
window.addEventListener('error', (event) => {
    console.error('💥 Глобальная ошибка:', event.error);
});
