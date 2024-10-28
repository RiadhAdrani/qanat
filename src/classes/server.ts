import { Context, AppError, Trie, type App, AppItemType } from './mod.ts';
import { chainMiddleware, resolvePath, resolveSegments } from '../helpers/mod.ts';
import type { Method, MiddlewareHandler, RouteHandler } from '../types/mod.ts';
import { STATUS_CODE, STATUS_TEXT } from '../constants/status-code.ts';

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
    let response: Response;

    try {
      response = await new Promise<Response>((resolve, reject) => {
        const path = new URL(req.url).pathname;

        const result = this.trie.find(req.method, path);

        if (!result) {
          return reject(new AppError({ message: 'not found', status: 404 }));
        }

        const ctx = new Context(req, info, resolve, result);

        result.handler(ctx);
      });
    } catch (error) {
      if (error instanceof AppError) {
        response = new Response(STATUS_TEXT[error.status], { status: error.status });
      } else {
        response = new Response(STATUS_TEXT[STATUS_CODE.InternalServerError], {
          status: STATUS_CODE.InternalServerError,
        });
      }
    }

    return response;
  }
}

export type ServerEndpoint = {
  method: Method;
  path: string;
  segments: Array<string>;
  handler: RouteHandler;
};
