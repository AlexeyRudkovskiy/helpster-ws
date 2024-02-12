import { WebSocketServer } from 'ws'
import { createClient } from 'redis'
import Client from "./client.js";
import ChatContainer from "./chat-container.js";
import Message from "./message.js";

const port = 8080;
const wss = new WebSocketServer({ port: port, host: '0.0.0.0' });

const clients = [];
const chatContainer = new ChatContainer();

const redisClient = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

await redisClient.subscribe('laravel_database_message', (message, channel) => {
    message = JSON.parse(message);
    const { event, data } = message;

    switch (event) {
        case "App\\Events\\NewMessage":
            forwardNewMessage(data);
            break;
    }
});

const forwardNewMessage = (payload) => {
    const { message, organization_id } = payload;
    const { chat_id, message: text } = message;

    /// todo: check is chat exists and not empty

    const authorId = message.user_id !== null ? `agent_${message.user_id}` : `customer_${message.customer_id}`;
    let author = clients.find(client => client.id === authorId);

    if (author === undefined) {
        author = new Client(authorId);
    }

    if (chatContainer.hasChat(chat_id)) {
        chatContainer.emitMessage(chat_id, new Message(author, text, message));
    }

    /// Send notification to all agents in organization
    clients
      .filter(agent => agent.getOrganizationId() === organization_id)
      .forEach(agent => {
          emit(agent.getConnection(), 'update', message)
      })

}

const emit = (connection, event, payload) => {
    connection.send(JSON.stringify({ event, payload }))
}

console.log(`Server started at localhost:${port}`);

wss.on('connection', (ws) => {

    let client = null;

    // Когда клиент отправляет сообщение
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        const { event, payload } = parsedMessage;

        switch (event) {
            case 'register':
                client = new Client(payload.id, payload.organization_id);
                client.setConnection(ws);
                client.setOnNewMessage(message => {
                    emit(ws, 'message', { message: message.getMessage(), payload: message.getPayload() })
                });
                clients.push(client);

                console.log('==> Client connected: ' + client.getId() + ', ' + payload.organization_id + ' (' + client.getOrganizationId() + ')')

                break;
            case 'join':
                chatContainer.register(payload.chatId).appendClient(client);
                console.log(`==> Client ${client.getId()} joined the chat ${payload.chatId}`)
                break;
            case 'left':
                const currentChat = chatContainer.getChat(payload.chatId);
                if (currentChat !== null) {
                    currentChat.removeClient(client.getId());
                }
                console.log(`==> Client ${client.getId()} left the chat ${payload.chatId}`)
                break;
            case 'send':
                chatContainer.emitMessage(payload.chatId, new Message(client, payload.message));
                break;
        }
    });

    // Когда клиент отключается
    ws.on('close', () => {
        const index = clients.indexOf(client);

        if (index < 0) {
            return ;
        }

        clients.splice(index, 1);

        client.getChats()
            .forEach(chat => chat.removeClient(client.getId()));
    });
});
