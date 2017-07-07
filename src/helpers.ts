/**
 * Promise resolve type shortcut.
 */
export type PromiseResolveType<T> = (value?: T | PromiseLike<T>) => void

/**
 * Promise reject type shortcut.
 */
export type PromiseRejectType = (reason?: any) => void
