import type { Context, ContextData } from '../context.ts';
import type { Asyncable, StringWithAutoComplete } from './helpers.ts';
import { HTTP_METHODS } from '../values.ts';

export type RouteParameters = Record<string, string | undefined>;

export type HandlerRequestInfo = Deno.ServeHandlerInfo<Deno.NetAddr>;

export type RawHandler<T = unknown> = (req: Request, info: HandlerRequestInfo) => Asyncable<T>;

export type RouteHandler<T extends ContextData = ContextData> = (ctx: Context<T>) => Asyncable<void>;

export type MiddlewareHandler<T extends ContextData = ContextData> = (
  ctx: Context<T>,
  next: () => Promise<unknown>
) => Asyncable;

export type ErrorHandler = (err: Error, req: Request) => Asyncable<unknown>;

export type KnownMethods = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

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
