import type { Context, ContextData } from '../classes/mod.ts';
import type { Asyncable } from './mod.ts';

export type HandlerRequestInfo = Deno.ServeHandlerInfo<Deno.NetAddr>;

export type RawHandler<T = unknown> = (req: Request, info: HandlerRequestInfo) => Asyncable<T>;

export type RouteHandler<T extends ContextData = ContextData> = (ctx: Context<T>) => Asyncable<void>;

export type ErrorHandler = (err: unknown, ctx: Context) => Asyncable<unknown>;
