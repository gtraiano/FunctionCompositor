import { ChainAction } from './chain';
import { InputAction } from './input';

export * from './chain';
export * from './input';

export type Action<T> = ChainAction<T> | InputAction<T>;