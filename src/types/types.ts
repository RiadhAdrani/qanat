import type { Context, ContextData } from '../context.ts';
import type { Asyncable, StringWithAutoComplete } from './helpers.ts';

export type HandlerRequestInfo = Deno.ServeHandlerInfo<Deno.NetAddr>;

export type RawHandler<T = unknown> = (req: Request, info: HandlerRequestInfo) => Asyncable<T>;

export type RouteHandler<T extends ContextData = ContextData> = (ctx: Context<T>) => Asyncable<void>;

export type MiddlewareHandler<T extends ContextData = ContextData> = (
  ctx: Context<T>,
  next: () => Promise<unknown>
) => Asyncable;

export type ErrorHandler = (err: Error, req: Request) => Asyncable<unknown>;

export type KnownMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';

export type Method = StringWithAutoComplete<KnownMethods>;

export type ResponseOptions = ResponseInit;

export enum ResponseType {
  Json,
  Text,
  Blob,
  Buffer,
  FormData,
  UrlSearchParams,
  Stream,
}

export type ResponseData = {
  data: unknown;
  options: ResponseOptions;
  type: ResponseType;
};
