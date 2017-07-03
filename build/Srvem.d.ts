/// <reference types="node" />
import { SrvMiddleware, SrvRequest, SrvResponse } from '@srvem/middleware';
import { Server } from 'http';
export declare class Srvem {
    private middleware;
    server: Server;
    constructor();
    use(...middleware: SrvMiddleware[]): void;
    handle(...handlers: ((request: SrvRequest, response: SrvResponse) => void)[]): void;
    start(): Server;
}
