const WebSocket = require('ws');

// Создаем WebSocket сервер на порту 8080
const wss = new WebSocket.Server({ port: 8080 });

// Массив для хранения активных соединений
const clients = new Set();

// Когда клиент подключается
wss.on('connection', (ws) => {
    console.log('Новое соединение установлено.');

    // Добавляем клиента в список активных соединений
    clients.add(ws);

    // Когда клиент отправляет сообщение
    ws.on('message', (message) => {
        console.log(`Получено сообщение: ${message}`);

        // Рассылаем сообщение всем клиентам
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Когда клиент отключается
    ws.on('close', () => {
        console.log('Соединение закрыто.');

        // Удаляем клиента из списка активных соединений
        clients.delete(ws);
    });
});
