import ChatContainer from "./chat-container.js";
import Chat from "./chat.js";
import Client from "./client.js";
import Message from "./message.js";

const chatContainer = new ChatContainer();

const chatId = 'new-chat';
const chat = chatContainer.register(chatId);

let adminClient = new Client("admin-client");
let customerClient = new Client("customer-client");
let agent1 = new Client("agent1-client")
chat.appendClient(adminClient);
chat.appendClient(agent1)
chat.appendClient(customerClient)

console.log(chat);

chatContainer.emitMessage(chatId, new Message(adminClient, "Hello world! This is first message"));
chatContainer.emitMessage(chatId, new Message(customerClient, "Em.. Hi!"))
