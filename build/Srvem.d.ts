/// <reference types="node" />
import { SrvMiddleware } from '@srvem/middleware';
import { IncomingMessage, Server, ServerResponse } from 'http';
export declare class Srvem {
    private middleware;
    server: Server;
    constructor();
    use(...middleware: SrvMiddleware[]): void;
    handle(...handlers: ((request: IncomingMessage, response: ServerResponse) => void)[]): void;
    start(): Server;
}
