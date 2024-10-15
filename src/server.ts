import { AppItemType, type App } from './app.ts';
import { resolvePath, resolveSegments } from './helpers/functions.ts';
import type { Method, RawHandler } from './types/types.ts';

export class Server {
  routes: Array<ServerEndpoint> = [];

  constructor(apps: Array<App>) {
    apps.forEach((app) =>
      app.items.forEach((item) => {
        if (item.type === AppItemType.App) {
          throw new Error('not implemented');
        }

        const path = resolvePath([app.prefix, item.path]);
        const segments = resolveSegments(path);

        this.routes.push({
          method: item.method,
          path,
          segments,
          handlers: item.handlers,
        });
      })
    );
  }

  findRoute(req: Request): ServerEndpoint | undefined {
    if (this.routes.length === 0) {
      return undefined;
    }

    const method = req.method;
    const path = new URL(req.url).pathname;

    return this.routes.find((endpoint) => endpoint.method === method && endpoint.path === path);
  }

  getHandler() {
    // deno-lint-ignore no-this-alias
    const server = this;

    return async (req: Request) => {
      try {
        const route = server.findRoute(req);

        if (!route) {
          return new Response('not found', { status: 404 });
        }

        let data: unknown = undefined;

        for (const fn of route.handlers) {
          data = await fn(req);
        }

        return new Response(JSON.stringify(data), { status: 200 });
      } catch (error) {
        console.error(error);

        return new Response('internal server error', { status: 500 });
      }
    };
  }
}

export type ServerEndpoint = {
  method: Method;
  path: string;
  segments: Array<string>;
  handlers: Array<RawHandler>;
};
