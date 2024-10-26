import type { FindTrieResult } from './classes/trie.ts';
import type { RouteParameters } from './types/types.ts';
import { ResponseType, type HandlerRequestInfo, type ResponseData, type ResponseOptions } from './types/types.ts';
import type { StatusCode } from './values.ts';

export type RequestResolve = (data: ResponseData) => void;

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
  private resolve: RequestResolve;

  constructor(request: Request, info: HandlerRequestInfo, resolve: RequestResolve, trie: FindTrieResult) {
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

  send(data: unknown, options: ResponseOptions, type: ResponseType = ResponseType.Json) {
    this.resolve({ data, options, type });
  }

  redirect(url: string, status: StatusCode = 302) {
    this.resolve({ data: url, options: { status }, type: ResponseType.Redirection });
  }

  json(data: unknown, options: ResponseOptions = {}) {
    this.send(data, options, ResponseType.Json);
  }

  text(data: string, options: ResponseOptions = {}) {
    this.send(data, options, ResponseType.Text);
  }

  blob(data: Blob, options: ResponseOptions = {}) {
    this.send(data, options, ResponseType.Blob);
  }

  buffer(data: ArrayBuffer, options: ResponseOptions = {}) {
    this.send(data, options, ResponseType.Buffer);
  }

  formData(data: FormData, options: ResponseOptions = {}) {
    this.send(data, options, ResponseType.FormData);
  }

  urlSearchParams(data: URLSearchParams, options: ResponseOptions = {}) {
    this.send(data, options, ResponseType.UrlSearchParams);
  }

  stream(data: ReadableStream, options: ResponseOptions = {}) {
    this.send(data, options, ResponseType.Stream);
  }
}
