import type { HttpMethod } from '../constants/mod.ts';
import type { StringWithAutoComplete } from './helpers.ts';

export type RouteParameters = Record<string, string | undefined>;

export type Method = StringWithAutoComplete<HttpMethod>;
