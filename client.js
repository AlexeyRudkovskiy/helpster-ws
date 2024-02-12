import Message from './message.js'

class Client {

    _id;

    _organization_id = -1;

    connection;

    onNewMessage;

    chats;

    constructor(id, organization_id) {
        this._id = id;
        this._organization_id = organization_id;
        this.onNewMessage = null;
        this.chats = [];
        this.connection = null;
    }

    emitMessage(message, chat) {
        if (this.onNewMessage !== null) {
            this.onNewMessage.call(null, message, chat);
        }
    }

    addChat(chat) {
        this.chats.push(chat);
    }

    getChats() {
        return this.chats;
    }

    setOnNewMessage(callback) {
        this.onNewMessage = callback;
    }

    getId() {
        return this._id;
    }

    getOrganizationId() {
        return this._organization_id;
    }

    getConnection() {
        return this.connection;
    }

    setConnection(connection) {
        this.connection = connection;
    }

}

export default Client;
