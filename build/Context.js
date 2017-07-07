"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
/**
 * A context created when a request is received by the server while listening.
 * All things related to the request and response are found in `this`.
 * The native http.Server request can be found at `this.request`.
 * Middlewares and handlers modify this (especially `this.statusCode` and `this.body`).
 */
class Context {
    /**
     * Construct a new Context from the native request and response objects.
     *
     * @param request http.Server's request
     * @param response http.Server's response
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;
        /**
         * The Date this context was created on.
         */
        this.createdOn = Date.now();
        /**
         * Response body.
         */
        this.body = null;
    }
    /**
     * Request method.
     */
    get method() {
        return this.request.method;
    }
    /**
     * Request url.
     */
    get url() {
        return this.request.url;
    }
    /**
     * Response status code.
     */
    get statusCode() {
        return this.response.statusCode;
    }
    set statusCode(statusCode) {
        this.response.statusCode = statusCode;
    }
    // todo check header ???
    /**
     * Response status message.
     */
    get statusMessage() {
        return this.response.statusMessage;
    }
    set statusMessage(statusMessage) {
        this.response.statusMessage = statusMessage;
    }
    // todo check header ???
    /**
     * Send date on response?
     */
    get sendDate() {
        return this.response.sendDate;
    }
    set sendDate(value) {
        this.response.sendDate = value;
    }
    /**
     * Get response headers.
     */
    get headers() {
        return this.response.getHeaders();
    }
    /**
     * Returns all response header names.
     */
    get headerNames() {
        return this.response.getHeaderNames();
    }
    /**
     * Checks if a response header with a provided name exists
     *
     * @param name Response header name
     */
    hasHeader(name) {
        return this.response.hasHeader(name);
    }
    /**
     * Gets the value of response header name (returns null if it doesn't exist).
     *
     * @param name Response header name
     */
    getHeader(name) {
        return this.response.getHeader(name);
    }
    /**
     * Sets a value for a response header name.
     *
     * @param name Response header name
     * @param value Response header value
     */
    setHeader(name, value) {
        return this.response.setHeader(name, value);
    }
    /**
     * Deletes a response header.
     *
     * @param name Response header name
     */
    removeHeader(name) {
        return this.response.removeHeader(name);
    }
    /**
     * Sets timeout on the response.
     *
     * @param milliseconds Timeout milliseconds
     */
    async setTimeout(milliseconds) {
        return new Promise((resolve, reject) => {
            this.response.setTimeout(milliseconds, () => resolve(this));
        });
    }
    /**
     * Finishes the response by requesting and receiving the response from a new path.
     *
     * @beta This feature has not been properly tested yet.
     *
     * @param path New path
     * @param statusCode Response status code
     * @param requestOptions Redirected request options
     */
    async redirect(path, statusCode = 301, requestOptions = {
            protocol: 'http:',
            headers: this.response.getHeaders(),
            method: this.request.method,
            path: path
        }) {
        return new Promise((resolve, reject) => {
            http_1.request(requestOptions, (response) => {
                response.on('error', (err) => reject(err));
                let newBody = '';
                response.on('data', (chunk) => {
                    newBody += chunk;
                });
                response.on('end', () => resolve(this.finish(newBody, statusCode)));
            });
        });
    }
    /**
     * Is the response finished?
     */
    get finished() {
        return this.response.finished;
    }
    /**
     * Ends the response after writing the response body.
     *
     * @param body Overriding response body
     * @param statusCode Overriding status code
     */
    finish(body, statusCode) {
        return new Promise((resolve, reject) => {
            if (body)
                this.body = body;
            if (statusCode)
                this.statusCode = statusCode;
            if (this.finished)
                return reject(new Error('Response is already finished.'));
            this.response.writeHead(this.statusCode, this.headers);
            if (this.body)
                this.response.write(this.body, () => resolve(this.terminate()));
            else
                resolve(this.terminate());
        });
    }
    /**
     * Ends the response without writing the response body.
     *
     * @param statusCode Overriding status code
     */
    terminate(statusCode) {
        return new Promise((resolve, reject) => {
            if (statusCode)
                this.statusCode = statusCode;
            this.response.end(() => {
                this.response.finished = true;
                resolve(this);
            });
        });
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map