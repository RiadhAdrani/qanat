import { RawHandler, type Method } from './types.ts';

export class App {
  prefix: string = '';
  items: Array<AppItem> = [];
  middlewares: Array<unknown> = [];

  constructor(prefix = '') {
    this.prefix = prefix;
  }

  middleware() {
    return this;
  }

  error() {
    return this;
  }

  app(prefix: string, app: App): App {
    this.items.push({ app, prefix, type: AppItemType.App });

    return this;
  }

  route(method: Method, path: string, ...handlers: Array<RawHandler>) {
    this.items.push({ method, path, handlers, type: AppItemType.Endpoint });

    return this;
  }

  get(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('GET', path, ...handlers);
  }

  post(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('POST', path, ...handlers);
  }

  patch(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('PATCH', path, ...handlers);
  }

  put(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('PUT', path, ...handlers);
  }

  delete(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('DELETE', path, ...handlers);
  }

  options(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('OPTIONS', path, ...handlers);
  }

  head(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('HEAD', path, ...handlers);
  }

  trace(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('TRACE', path, ...handlers);
  }

  connect(path: string, ...handlers: Array<RawHandler>): App {
    return this.route('CONNECT', path, ...handlers);
  }
}

export enum AppItemType {
  Endpoint,
  App,
}

export type AppItemBase<T extends AppItemType> = {
  type: T;
};

export interface AppEndpoint extends AppItemBase<typeof AppItemType.Endpoint> {
  method: string;
  path: string;
  handlers: Array<RawHandler>;
}

export interface SubApp extends AppItemBase<typeof AppItemType.App> {
  prefix: string;
  app: App;
}

export type AppItem = AppEndpoint | SubApp;
