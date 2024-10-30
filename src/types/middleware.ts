import type { HttpContext, ContextData, SocketContext, Context } from '../classes/mod.ts';
import type { Asyncable } from './helpers.ts';

export type MiddlewareHandler<T extends ContextData = ContextData> = (
  ctx: Context<T>,
  next: () => Promise<unknown>
) => Asyncable<unknown>;

export type HttpMiddlewareHandler<T extends ContextData = ContextData> = (
  ctx: HttpContext<T>,
  next: () => Promise<unknown>
) => Asyncable;

export type SocketMiddlewareHandler<T extends ContextData = ContextData> = (
  ctx: SocketContext<T>,
  next: () => Promise<unknown>
) => Asyncable;
