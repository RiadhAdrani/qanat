import type { Context } from '../context.ts';
import type { HandlerRequestInfo, RawHandler, MiddlewareHandler, RouteHandler } from '../types/types.ts';

export const resolvePath = (items: Array<string>): string => {
  // replace successive leading slashes
  return items.join('/').replaceAll(/(\/)+/g, '/');
};

export const resolveSegments = (path: string) => {
  return path.split('/').filter(Boolean);
};

export const chainMiddleware = (handler: RouteHandler, middlewares: Array<MiddlewareHandler>): RouteHandler => {
  let fn: RouteHandler = handler;

  const getNext = (ctx: Context, index: number) => async () => {
    if (index >= middlewares.length) {
      return await handler(ctx);
    }

    return await middlewares[index](ctx, getNext(ctx, index + 1));
  };

  if (middlewares.length > 0) {
    fn = async (ctx) => {
      await middlewares[0](ctx, getNext(ctx, 1));
    };
  }

  return fn;
};
