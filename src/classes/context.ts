import type { FindTrieResult } from './mod.ts';
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

  private fullfiled: boolean = false;
  private data: T = {} as T;
  private resolve: (response: Response) => void;

  constructor(request: Request, info: HandlerRequestInfo, resolve: (response: Response) => void, trie: FindTrieResult) {
    this.request = request;
    this.info = info;
    this.params = trie.params;
    this.searchParams = new URL(request.url).searchParams;

    this.resolve = (response) => {
      if (this.fullfiled) {
        throw new Error('Request already fullfiled');
      }

      this.fullfiled = true;
      resolve(response);
    };
  }

  get(key: keyof T): T[keyof T] {
    return this.data[key];
  }
  set(key: keyof T, value: T[keyof T]) {
    this.data[key] = value;
  }

  send(response: Response) {
    this.resolve(response);
  }
}
