/// <reference types="node" />
import { Server } from 'http';
import { SrvContext } from './SrvContext';
import { SrvMiddlewareBlueprint } from './SrvMiddlewareBlueprint';
export declare class Srvem {
    private middleware;
    server: Server;
    constructor();
    use(...middleware: SrvMiddlewareBlueprint[]): void;
    handle(...handlers: ((ctx: SrvContext) => void)[]): void;
    ready(): Server;
}
