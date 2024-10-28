import HTTP_METHODS from '../constants/http-mthods.ts';
import { type Method, type MiddlewareHandler, type RouteHandler } from '../types/mod.ts';
import type { ContextData } from './context.ts';

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

  app(prefix: string, app: App) {
    this.items.push({ app, prefix, type: AppItemType.App });

    return this;
  }

  route(method: Method, path: string, handler: RouteHandler<T>) {
    this.items.push({ method, path, handler, type: AppItemType.Endpoint });

    return this;
  }

  get(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.GET, path, handler);
  }

  post(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.POST, path, handler);
  }

  patch(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.PATCH, path, handler);
  }

  put(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.PUT, path, handler);
  }

  delete(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.DELETE, path, handler);
  }

  options(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.OPTIONS, path, handler);
  }

  head(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.HEAD, path, handler);
  }

  trace(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.TRACE, path, handler);
  }

  connect(path: string, handler: RouteHandler<T>) {
    return this.route(HTTP_METHODS.CONNECT, path, handler);
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
