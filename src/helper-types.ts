import { SrvContext } from './SrvContext'

export type PromiseResolveType<T> = (value?: T | PromiseLike<T>) => void

export type PromiseRejectType = (reason?: any) => void

export type CtxPromiseType = Promise<SrvContext>

export type CtxResolveType = (value?: SrvContext | PromiseLike<SrvContext>) => void

export type SrvHandlerType = (ctx: SrvContext, next: () => CtxPromiseType) => CtxPromiseType
