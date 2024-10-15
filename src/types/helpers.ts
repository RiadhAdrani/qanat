export type Asyncable<T = void> = T | Promise<T>;

export type StringWithAutoComplete<T> = T | (string & Record<never, never>);
