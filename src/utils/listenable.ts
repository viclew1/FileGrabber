type Listener<EVENT_PAYLOADS, K extends keyof EVENT_PAYLOADS> = (payload: EVENT_PAYLOADS[K]) => void;

export class Listenable<EVENT_PAYLOADS> {
    constructor(private listeners: { [K in keyof EVENT_PAYLOADS]: Listener<EVENT_PAYLOADS, K>[] }) {}

    on<E extends keyof EVENT_PAYLOADS>(event: E, listener: Listener<EVENT_PAYLOADS, E>): this {
        this.listeners[event].push(listener);
        return this;
    }

    off<E extends keyof EVENT_PAYLOADS>(event: E, listener: (payload: EVENT_PAYLOADS[E]) => void): this {
        const eventListeners = this.listeners[event];
        const listenerIndex = eventListeners.indexOf(listener);
        if (listenerIndex === -1) return this;
        eventListeners.splice(listenerIndex, 1);
        return this;
    }

    emit<E extends keyof EVENT_PAYLOADS>(event: E, payload: EVENT_PAYLOADS[E]): boolean {
        try {
            this.listeners[event].forEach((listener) => listener(payload));
            return true;
        } catch (error) {
            console.error(`Error emitting event "${event.toString()}":`, error);
            return false;
        }
    }
}
