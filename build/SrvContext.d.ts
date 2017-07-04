/// <reference types="node" />
import { IncomingMessage, ServerResponse, ServerResponseHeaders } from 'http';
export declare class SrvContext {
    request: IncomingMessage;
    private response;
    body: Buffer | string | any;
    headers: ServerResponseHeaders;
    statusCode: number;
    statusMessage: string;
    defaultEncoding: string;
    sendDate: boolean;
    constructor(request: IncomingMessage, response: ServerResponse);
    setTimeout(milliseconds: number): Promise<void>;
    isFinished(): boolean;
    terminate(): Promise<boolean>;
    private _terminate();
    finish(): Promise<boolean>;
    private _setResponsePropertiesBack();
    hasHeader(name: string): boolean;
    getHeaderNames(): string[];
    getHeader(name: string): number | string | string[];
    setHeader(name: string, value: number | string | string[]): void;
    removeHeader(name: string): boolean;
}
