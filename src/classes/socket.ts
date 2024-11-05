import type {
  OnSocketCloseHandler,
  OnSocketErrorHandler,
  OnSocketMessageHandler,
  OnSocketOpenHandler,
  SocketMiddlewareHandler,
} from '../types/mod.ts';
import type { ContextData } from './context.ts';

export class Socket<T extends ContextData = ContextData> {
  prefix = '';
  items: Array<{ prefix: string; socket: Socket }> = [];
  middlewares: Array<SocketMiddlewareHandler<T>> = [];

  onopen: Array<OnSocketOpenHandler> = [];
  onmessage: Array<OnSocketMessageHandler> = [];
  onclose: Array<OnSocketCloseHandler> = [];
  onerror: Array<OnSocketErrorHandler> = [];

  get hasHandler() {
    return this.onopen.length > 0 || this.onmessage.length > 0 || this.onclose.length > 0 || this.onerror.length > 0;
  }

  constructor(prefix = '') {
    this.prefix = prefix;
  }

  middleware(handler: SocketMiddlewareHandler<T>) {
    this.middlewares.push(handler);
    return this;
  }

  socket(prefix: string, socket: Socket) {
    this.items.push({ socket, prefix });

    return this;
  }

  onOpen(handler: OnSocketOpenHandler) {
    this.onopen.push(handler);
    return this;
  }

  onMessage(handler: OnSocketMessageHandler) {
    this.onmessage.push(handler);
    return this;
  }

  onClose(handler: OnSocketCloseHandler) {
    this.onclose.push(handler);
    return this;
  }

  onError(handler: OnSocketErrorHandler) {
    this.onerror.push(handler);
    return this;
  }
}
