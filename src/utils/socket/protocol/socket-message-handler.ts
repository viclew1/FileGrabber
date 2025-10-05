import { Message } from './protocol-types';
import { Socket as ClientSocket } from 'socket.io-client';
import { Socket } from 'socket.io';

export abstract class SocketMessageHandler<RECEIVED_MESSAGE_TYPES, SENT_MESSAGE_TYPES> {
    private readonly messageHandlers: {
        [K in keyof RECEIVED_MESSAGE_TYPES]: (payload: RECEIVED_MESSAGE_TYPES[K]) => void;
    };

    protected constructor(protected socket: ClientSocket | Socket) {
        this.messageHandlers = this.initMessageHandlers();
    }

    protected abstract initMessageHandlers(): {
        [K in keyof RECEIVED_MESSAGE_TYPES]: (payload: RECEIVED_MESSAGE_TYPES[K]) => void;
    };

    public onMessageReceived(message: Message<RECEIVED_MESSAGE_TYPES>) {
        console.log('Received message:', message.type);
        this.messageHandlers[message.type](message.payload);
    }

    sendMessage(message: Message<SENT_MESSAGE_TYPES>) {
        console.log('Sending message:', message.type);
        this.socket.emit('message', message);
    }
}
