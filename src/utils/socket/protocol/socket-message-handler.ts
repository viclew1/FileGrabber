import { Message } from './protocol-types';
import { Socket as ClientSocket } from 'socket.io-client';
import { Socket } from 'socket.io';

export abstract class SocketMessageHandler<RECEIVED_MESSAGE_TYPES, SENT_MESSAGE_TYPES> {
    private readonly messageHandlers: {
        [K in keyof RECEIVED_MESSAGE_TYPES]: (payload: RECEIVED_MESSAGE_TYPES[K], ack?: () => void) => void;
    };

    protected constructor(protected socket: ClientSocket | Socket) {
        this.messageHandlers = this.initMessageHandlers();
    }

    protected abstract initMessageHandlers(): {
        [K in keyof RECEIVED_MESSAGE_TYPES]: (payload: RECEIVED_MESSAGE_TYPES[K], ack?: () => void) => void;
    };

    public onMessageReceived(message: Message<RECEIVED_MESSAGE_TYPES>, ack?: () => void) {
        this.messageHandlers[message.type](message.payload, ack);
    }

    sendMessage(message: Message<SENT_MESSAGE_TYPES>, onAck?: () => void) {
        if (onAck) {
            this.socket.emit('message', message, onAck);
        } else {
            this.socket.emit('message', message);
        }
    }
}
