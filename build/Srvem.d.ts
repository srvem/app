/// <reference types="node" />
import { SrvMiddleware } from '@srvem/middleware';
import { Server } from 'http';
export declare class Srvem {
    private middleware;
    server: Server;
    use(middleware: SrvMiddleware): void;
    private callback();
    start(): Server;
}
