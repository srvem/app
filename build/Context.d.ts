/// <reference types="node" />
import { IncomingMessage, RequestOptions, ServerResponse, ServerResponseHeaders } from 'http';
/**
 * A context created when a request is received by the server while listening.
 * All things related to the request and response are found in `this`.
 * The native http.Server request can be found at `this.request`.
 * Middlewares and handlers modify this (especially `this.statusCode` and `this.body`).
 */
export declare class Context {
    request: IncomingMessage;
    private response;
    /**
     * The Date this context was created on.
     */
    readonly createdOn: number;
    /**
     * Response body.
     */
    body: Buffer | string | any;
    /**
     * Request method.
     */
    readonly method: string;
    /**
     * Request url.
     */
    readonly url: string;
    /**
     * Construct a new Context from the native request and response objects.
     *
     * @param request http.Server's request
     * @param response http.Server's response
     */
    constructor(request: IncomingMessage, response: ServerResponse);
    /**
     * Response status code.
     */
    statusCode: number;
    /**
     * Response status message.
     */
    statusMessage: string;
    /**
     * Send date on response?
     */
    sendDate: boolean;
    /**
     * Get response headers.
     */
    readonly headers: ServerResponseHeaders;
    /**
     * Returns all response header names.
     */
    readonly headerNames: string[];
    /**
     * Checks if a response header with a provided name exists
     *
     * @param name Response header name
     */
    hasHeader(name: string): boolean;
    /**
     * Gets the value of response header name (returns null if it doesn't exist).
     *
     * @param name Response header name
     */
    getHeader(name: string): number | string | string[];
    /**
     * Sets a value for a response header name.
     *
     * @param name Response header name
     * @param value Response header value
     */
    setHeader(name: string, value: string | string[]): void;
    /**
     * Deletes a response header.
     *
     * @param name Response header name
     */
    removeHeader(name: string): void;
    /**
     * Sets timeout on the response.
     *
     * @param milliseconds Timeout milliseconds
     */
    setTimeout(milliseconds: number): Promise<Context>;
    /**
     * Finishes the response by requesting and receiving the response from a new path.
     *
     * @beta This feature has not been properly tested yet.
     *
     * @param path New path
     * @param statusCode Response status code
     * @param requestOptions Redirected request options
     */
    redirect(path: string, statusCode?: number, requestOptions?: RequestOptions): Promise<Context>;
    /**
     * Is the response finished?
     */
    readonly finished: boolean;
    /**
     * Ends the response after writing the response body.
     *
     * @param body Overriding response body
     * @param statusCode Overriding status code
     */
    finish(body?: any, statusCode?: number): Promise<Context>;
    /**
     * Ends the response without writing the response body.
     *
     * @param statusCode Overriding status code
     */
    terminate(statusCode?: number): Promise<Context>;
}
