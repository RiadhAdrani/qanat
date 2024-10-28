import type { Context, ContextData } from '../classes/mod.ts';
import type { Asyncable } from './helpers.ts';

export type MiddlewareHandler<T extends ContextData = ContextData> = (
  ctx: Context<T>,
  next: () => Promise<unknown>
) => Asyncable;
