import { ResponseType, type HandlerRequestInfo, type ResponseData, type ResponseOptions } from './types/types.ts';

export type RequestResolve = (data: ResponseData) => void;

export type ContextData = Record<string, unknown>;

export class Context<T extends ContextData = ContextData> {
  request: Request;
  info: HandlerRequestInfo;

  data: T = {} as T;
  fullfiled: boolean = false;

  private resolve: RequestResolve;

  constructor(request: Request, info: HandlerRequestInfo, resolve: RequestResolve) {
    this.request = request;
    this.info = info;

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

  send(data: unknown, options: ResponseOptions, type: ResponseType = ResponseType.Json) {
    this.resolve({ data, options, type });
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
