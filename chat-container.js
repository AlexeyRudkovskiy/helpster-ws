import Chat from "./chat.js";
import Message from "./message.js";

class ChatContainer {

    _chats = {};

    register(chatId) {
        if (this.hasChat(chatId)) {
            return this._chats[chatId];
        }

        this._chats[chatId] = new Chat();
        return this._chats[chatId];
    }

    emitMessage(chatId, message) {
        if (!this.hasChat(chatId)) {
            throw new Error(`Chat ${chatId} is not registered!`)
        }

        const chat = this.getChat(chatId);
        chat.emitMessage(message);
    }

    getChat(chatId) {
        if (!this.hasChat(chatId)) {
            throw new Error("Chat is not registered");
        }

        return this._chats[chatId];
    }

    hasChat(chatId) {
        return this._chats.hasOwnProperty(chatId);
    }

}

export default ChatContainer;
