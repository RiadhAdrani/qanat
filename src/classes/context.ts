import type { FindHttpTrieResult } from './mod.ts';
import type { RouteParameters, HandlerRequestInfo } from '../types/mod.ts';

export type ContextData = Record<string, unknown>;

export type ContextInputData = {
  params: RouteParameters;
};

export class Context<T extends ContextData = ContextData> {
  request: Request;
  info: HandlerRequestInfo;
  params: RouteParameters = {};
  searchParams: URLSearchParams = new URLSearchParams();

  isClosed: boolean = false;

  private data: T = {} as T;

  constructor(request: Request, info: HandlerRequestInfo) {
    this.request = request;
    this.info = info;
  }

  get(key: keyof T): T[keyof T] {
    return this.data[key];
  }

  set(key: keyof T, value: T[keyof T]) {
    this.data[key] = value;
  }
}

export class HttpContext<T extends ContextData = ContextData> extends Context<T> {
  private resolve: (response: Response) => void;

  constructor(
    request: Request,
    info: HandlerRequestInfo,
    resolve: (response: Response) => void,
    trie: FindHttpTrieResult
  ) {
    super(request, info);

    this.params = trie.params;
    this.searchParams = new URL(request.url).searchParams;

    this.resolve = (response) => {
      if (this.isClosed) {
        throw new Error('Request already fullfiled');
      }

      this.isClosed = true;
      resolve(response);
    };
  }

  send(response: Response) {
    this.resolve(response);
  }
}

export class SocketContext<T extends ContextData = ContextData> extends Context<T> {
  socket: WebSocket;

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this.socket.send(data);
  }

  constructor(request: Request, info: HandlerRequestInfo, socket: WebSocket) {
    super(request, info);
    this.socket = socket;
  }
}
