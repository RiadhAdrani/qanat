import type { Context } from '../classes/mod.ts';
import type { MiddlewareHandler } from '../types/middleware.ts';
import type { RouteHandler } from '../types/mod.ts';

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
