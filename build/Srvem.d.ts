/// <reference types="node" />
import { Server } from 'http';
import { SrvContext } from './SrvContext';
import { SrvMiddlewareBlueprint } from './SrvMiddlewareBlueprint';
export declare class Srvem {
    private middleware;
    private i;
    server: Server;
    constructor();
    use(...middleware: SrvMiddlewareBlueprint[]): void;
    handle(...handlers: ((ctx: SrvContext) => Promise<SrvContext>)[]): void;
    ready(): Server;
    private _runNext(ctx);
}
