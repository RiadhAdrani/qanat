import { AppItemType, type App } from './app.ts';
import { Trie } from './classes/trie.ts';
import { Context } from './context.ts';
import { AppError } from './error.ts';
import { chainMiddleware, resolvePath, resolveSegments } from './helpers/functions.ts';
import type { Method, MiddlewareHandler, ResponseData, ResponseOptions, RouteHandler } from './types/types.ts';
import { ResponseType } from './types/types.ts';

export class Server {
  trie: Trie = new Trie();

  constructor(apps: Array<App>) {
    apps.forEach((app) => this.extractRoutes('', app, []));
  }

  extractRoutes(prefix: string, app: App, previousMiddlewares: Array<MiddlewareHandler>) {
    const middlewares = [...previousMiddlewares, ...app.middlewares];

    app.items.forEach((it) => {
      if (it.type === AppItemType.App) {
        return this.extractRoutes(`${prefix}/${it.prefix}`, it.app, middlewares);
      }

      const path = resolvePath([prefix, app.prefix, it.path]);
      const segments = resolveSegments(path);

      const handler = chainMiddleware(it.handler, middlewares);

      this.trie.add(it.method, segments, handler);
    });
  }

  async handler(req: Request, info: Deno.ServeHandlerInfo<Deno.NetAddr>) {
    let response: unknown;
    let options: ResponseOptions = { status: 200 };
    let type: ResponseType = ResponseType.Json;

    try {
      const responseData = await new Promise<ResponseData>((resolve, reject) => {
        const path = new URL(req.url).pathname;

        const route = this.trie.find(req.method, path);

        if (!route) {
          return reject(new AppError({ message: 'not found', status: 404 }));
        }

        const input = { params: route.params };

        const ctx = new Context(req, info, resolve, input);

        route.handler(ctx);
      });

      response = responseData.data;
      options = responseData.options;
      type = responseData.type;
    } catch (error) {
      type = ResponseType.Json;

      if (error instanceof AppError) {
        response = error.message;
        options = { status: error.status };
      } else {
        response = 'internal server error';
        options = { status: 500 };
      }
    }

    let value: BodyInit;

    switch (type) {
      case ResponseType.Json: {
        value = JSON.stringify(response);
        break;
      }
      case ResponseType.Text: {
        value = String(response);
        break;
      }
      default: {
        value = 'response type no implemented';
        options = { status: 500 };
        break;
      }
    }

    return new Response(value, options);
  }
}

export type ServerEndpoint = {
  method: Method;
  path: string;
  segments: Array<string>;
  handler: RouteHandler;
};
