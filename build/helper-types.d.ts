import { SrvContext } from './SrvContext';
export declare type PromiseResolveType<T> = (value?: T | PromiseLike<T>) => void;
export declare type PromiseRejectType = (reason?: any) => void;
export declare type CtxPromiseType = Promise<SrvContext>;
export declare type CtxResolveType = (value?: SrvContext | PromiseLike<SrvContext>) => void;
export declare type SrvHandlerType = (ctx: SrvContext, next: () => CtxPromiseType) => CtxPromiseType;
