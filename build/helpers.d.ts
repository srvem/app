/**
 * Promise resolve type shortcut.
 */
export declare type PromiseResolveType<T> = (value?: T | PromiseLike<T>) => void;
/**
 * Promise reject type shortcut.
 */
export declare type PromiseRejectType = (reason?: any) => void;
