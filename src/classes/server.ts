import { STATUS_CODE, STATUS_TEXT } from '../constants/status-code.ts';
import { chainMiddlewares, resolvePath, resolveSegments } from '../helpers/mod.ts';
import type {
  HttpHandler,
  HttpMiddlewareHandler,
  Method,
  SocketHandler,
  SocketMiddlewareHandler,
} from '../types/mod.ts';
import { AppError, AppItemType, HttpContext, HttpTrie, Socket, SocketContext, SocketTrie, type App } from './mod.ts';

export class Server {
  http: HttpTrie = new HttpTrie();
  socket: SocketTrie = new SocketTrie();

  constructor(apps: Array<App | Socket>) {
    apps.forEach((app) => {
      if (app instanceof Socket) {
        this.extractSocketRoutes('', app, []);
      } else {
        this.extractHttpRoutes('', app, []);
      }
    });
  }

  extractHttpRoutes(prefix: string, app: App, previousMiddlewares: Array<HttpMiddlewareHandler>) {
    const middlewares = [...previousMiddlewares, ...app.middlewares];

    app.items.forEach((it) => {
      if (it.type === AppItemType.App) {
        return this.extractHttpRoutes(`${prefix}/${it.prefix}`, it.app, middlewares);
      }

      const path = resolvePath([prefix, app.prefix, it.path]);
      const segments = resolveSegments(path);

      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      const handler = chainMiddlewares<HttpHandler, HttpMiddlewareHandler, HttpContext>(it.handler, middlewares);

      this.http.add(it.method, segments, handler);
    });
  }

  extractSocketRoutes(prefix: string, app: Socket, previousMiddlewares: Array<SocketMiddlewareHandler>) {
    const middlewares = [...previousMiddlewares, ...app.middlewares];

    const path = resolvePath([prefix, app.prefix]);
    const segments = resolveSegments(path);

    if (app.hasHandler) {
      const baseHandler: SocketHandler = (ctx: SocketContext) => {
        if (app.onmessage.length > 0) {
          ctx.socket.onmessage = async (ev) => {
            for (const handler of app.onmessage) {
              await handler(ctx, ev);
            }
          };
        }

        if (app.onclose.length > 0) {
          ctx.socket.onclose = async (ev) => {
            for (const handler of app.onclose) {
              await handler(ctx, ev);
            }
          };
        }

        if (app.onopen.length > 0) {
          ctx.socket.onopen = async (ev) => {
            for (const handler of app.onopen) {
              await handler(ctx, ev);
            }
          };
        }

        if (app.onerror.length > 0) {
          ctx.socket.onerror = async (ev) => {
            for (const handler of app.onerror) {
              await handler(ctx, ev);
            }
          };
        }
      };

      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      const handler = chainMiddlewares<SocketHandler, SocketMiddlewareHandler, SocketContext>(baseHandler, middlewares);

      this.socket.add(segments, handler);
    }

    app.items.forEach((it) => {
      const subPath = resolvePath([path, it.prefix]);

      this.extractSocketRoutes(subPath, it.socket, middlewares);
    });
  }

  async handler(req: Request, info: Deno.ServeHandlerInfo<Deno.NetAddr>) {
    let response: Response;

    try {
      const path = new URL(req.url).pathname;

      const isSocket = req.headers.get('upgrade') === 'websocket';

      if (isSocket) {
        const upgrade = Deno.upgradeWebSocket(req);
        response = upgrade.response;

        const { socket } = upgrade;

        const result = this.socket.find(path);

        if (!result) {
          setTimeout(() => socket.close(1000, 'not found'));

          throw new AppError({ message: 'not found', status: 404 });
        }

        const ctx = new SocketContext(req, info, socket);

        if (result.handlers.length > 0) {
          for (const handler of result.handlers) {
            await handler(ctx);
          }
        } else {
          setTimeout(() => socket.close(1000, 'not found'));
        }
      } else {
        response = await new Promise<Response>((resolve, reject) => {
          const result = this.http.find(req.method, path);

          if (!result) {
            return reject(new AppError({ message: 'not found', status: 404 }));
          }

          const ctx = new HttpContext(req, info, resolve, result);

          result.handler(ctx);
        });
      }
    } catch (error) {
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      if (!response) {
        if (error instanceof AppError) {
          response = new Response(STATUS_TEXT[error.status], { status: error.status });
        } else {
          response = new Response(STATUS_TEXT[STATUS_CODE.InternalServerError], {
            status: STATUS_CODE.InternalServerError,
          });
        }
      }
    }

    return response;
  }
}

export type ServerEndpoint = {
  method: Method;
  path: string;
  segments: Array<string>;
  handler: HttpHandler;
};
