import type { Asyncable, StringWithAutoComplete } from './helpers.ts';

export type RawHandler<T = unknown> = (req: Request) => Asyncable<T>;

export type ErrorHandler = (err: Error, req: Request) => Asyncable<unknown>;

export type KnownMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';

export type Method = StringWithAutoComplete<KnownMethods>;
