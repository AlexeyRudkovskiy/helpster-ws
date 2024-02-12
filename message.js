class Message {

    _client;
    _message;
    _payload;

    constructor(client, message, payload = null) {
        this._client = client;
        this._message = message;
        this._payload = payload;
    }

    getClient() {
        return this._client;
    }

    getMessage() {
        return this._message;
    }

    getPayload() {
        return this._payload;
    }

}

export default Message;
