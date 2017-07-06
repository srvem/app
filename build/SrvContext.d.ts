/// <reference types="node" />
import { IncomingMessage, RequestOptions, ServerResponse, ServerResponseHeaders } from 'http';
export declare class SrvContext {
    request: IncomingMessage;
    private response;
    readonly createdOn: number;
    body: Buffer | string | any;
    constructor(request: IncomingMessage, response: ServerResponse);
    statusCode: number;
    statusMessage: string;
    sendDate: boolean;
    readonly getHeaders: ServerResponseHeaders;
    readonly getHeaderNames: string[];
    hasHeader(name: string): boolean;
    getHeader(name: string): number | string | string[];
    setHeader(name: string, value: number | string | string[]): void;
    removeHeader(name: string): void;
    setTimeout(milliseconds: number): Promise<void>;
    redirect(path: string, statusCode?: number, requestOptions?: RequestOptions): Promise<SrvContext>;
    readonly isFinished: boolean;
    finish(body?: any, statusCode?: number): Promise<SrvContext>;
    terminate(statusCode?: number): Promise<SrvContext>;
}
