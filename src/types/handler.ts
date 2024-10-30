import type { HttpContext, ContextData, SocketContext, Context } from '../classes/mod.ts';
import type { Asyncable } from './mod.ts';

export type RawHandler<T = unknown> = (req: Request, info: HandlerRequestInfo) => Asyncable<T>;
export type HandlerRequestInfo = Deno.ServeHandlerInfo<Deno.NetAddr>;
export type RouteHandler<T extends ContextData = ContextData> = (ctx: Context<T>) => Asyncable<void>;

export type HttpHandler<T extends ContextData = ContextData> = (ctx: HttpContext<T>) => Asyncable<void>;

export type SocketHandler<T extends ContextData = ContextData> = (ctx: SocketContext<T>) => Asyncable<void>;
export type OnSocketOpen = (socket: WebSocket, ev: Event) => unknown;
export type OnSocketError = (socket: WebSocket, ev: Event | ErrorEvent) => unknown;
export type OnSocketMessage = (socket: WebSocket, ev: MessageEvent) => unknown;
export type OnSocketClose = (socket: WebSocket, ev: CloseEvent) => unknown;

export type OnSocketOpenHandler = <T extends ContextData = ContextData>(
  ctx: SocketContext<T>,
  event: Event
) => Asyncable<unknown>;
export type OnSocketErrorHandler = <T extends ContextData = ContextData>(
  ctx: SocketContext<T>,
  event: Event | ErrorEvent
) => Asyncable<unknown>;
export type OnSocketMessageHandler = <T extends ContextData = ContextData>(
  ctx: SocketContext<T>,
  event: MessageEvent
) => Asyncable<unknown>;
export type OnSocketCloseHandler = <T extends ContextData = ContextData>(
  ctx: SocketContext<T>,
  event: CloseEvent
) => Asyncable<unknown>;

export type ErrorHandler = (err: unknown, ctx: HttpContext) => Asyncable<unknown>;
