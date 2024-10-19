import type { ContextData } from './context.ts';
import { type Method, type MiddlewareHandler, type RouteHandler } from './types/types.ts';

export class App<T extends ContextData = ContextData> {
  prefix: string = '';
  items: Array<AppItem<T>> = [];
  middlewares: Array<MiddlewareHandler<T>> = [];

  constructor(prefix = '') {
    this.prefix = prefix;
  }

  middleware(handler: MiddlewareHandler<T>) {
    this.middlewares.push(handler);
    return this;
  }

  error() {
    return this;
  }

  app(prefix: string, app: App) {
    this.items.push({ app, prefix, type: AppItemType.App });

    return this;
  }

  route(method: Method, path: string, handler: RouteHandler<T>) {
    this.items.push({ method, path, handler, type: AppItemType.Endpoint });

    return this;
  }

  get(path: string, handler: RouteHandler<T>) {
    return this.route('GET', path, handler);
  }

  post(path: string, handler: RouteHandler<T>) {
    return this.route('POST', path, handler);
  }

  patch(path: string, handler: RouteHandler<T>) {
    return this.route('PATCH', path, handler);
  }

  put(path: string, handler: RouteHandler<T>) {
    return this.route('PUT', path, handler);
  }

  delete(path: string, handler: RouteHandler<T>) {
    return this.route('DELETE', path, handler);
  }

  options(path: string, handler: RouteHandler<T>) {
    return this.route('OPTIONS', path, handler);
  }

  head(path: string, handler: RouteHandler<T>) {
    return this.route('HEAD', path, handler);
  }

  trace(path: string, handler: RouteHandler<T>) {
    return this.route('TRACE', path, handler);
  }

  connect(path: string, handler: RouteHandler<T>) {
    return this.route('CONNECT', path, handler);
  }
}

export enum AppItemType {
  Endpoint,
  App,
}

export type AppItemBase<T extends AppItemType> = {
  type: T;
};

export interface AppEndpoint<T extends ContextData = ContextData> extends AppItemBase<typeof AppItemType.Endpoint> {
  method: string;
  path: string;
  handler: RouteHandler<T>;
}

export interface SubApp extends AppItemBase<typeof AppItemType.App> {
  prefix: string;
  app: App;
}

export type AppItem<T extends ContextData = ContextData> = AppEndpoint<T> | SubApp;
