import type { Context } from '../classes/mod.ts';
import type { MiddlewareHandler, RouteHandler } from '../types/mod.ts';

export const chainMiddlewares = <
  H extends RouteHandler = RouteHandler,
  M extends MiddlewareHandler = MiddlewareHandler,
  C extends Context = Context
>(
  handler: H,
  middlewares: Array<M>
): H => {
  let fn: H = handler;

  const getNext = (ctx: C, index: number) => async () => {
    if (index >= middlewares.length) {
      return await handler(ctx);
    }

    return await middlewares[index](ctx, getNext(ctx, index + 1));
  };

  if (middlewares.length > 0) {
    fn = (async (ctx) => {
      await middlewares[0](ctx, getNext(ctx as C, 1));
    }) as H;
  }

  return fn;
};
