class Chat {

    _clients = [];

    appendClient(client) {
        this._clients.push(client);
        client.addChat(this);
        return client;
    }

    removeClient(clientId) {
        this._clients = this._clients.filter(client => client.getId() !== clientId);
    }

    replaceClient(client) {
        if (this.hasClient(client.getId())) {
            this._clients = this._clients.filter(_client => _client.getId() !== client.getId());
            console.log(`Replacing client ${client.getId()}`);
        }

        this._clients.push(client);
        client.addChat(this);
        return client;
    }

    emitMessage(message) {
        this._clients
            .forEach(client => client.emitMessage(message, this));
    }

    hasClient(clientId) {
        return this._clients.find(client => client.getId() === clientId);
    }

}

export default Chat
