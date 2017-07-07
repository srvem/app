"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
class SrvContext {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.createdOn = Date.now();
        this.body = null;
    }
    get statusCode() {
        return this.response.statusCode;
    }
    set statusCode(statusCode) {
        this.response.statusCode = statusCode;
    }
    get statusMessage() {
        return this.response.statusMessage;
    }
    set statusMessage(statusMessage) {
        this.response.statusMessage = statusMessage;
    }
    get sendDate() {
        return this.response.sendDate;
    }
    set sendDate(value) {
        this.response.sendDate = value;
    }
    get getHeaders() {
        return this.response.getHeaders();
    }
    get getHeaderNames() {
        return this.response.getHeaderNames();
    }
    hasHeader(name) {
        return this.response.hasHeader(name);
    }
    getHeader(name) {
        return this.response.getHeader(name);
    }
    setHeader(name, value) {
        return this.response.setHeader(name, value);
    }
    removeHeader(name) {
        return this.response.removeHeader(name);
    }
    setTimeout(milliseconds) {
        return new Promise((resolve, reject) => {
            this.response.setTimeout(milliseconds, () => resolve(this));
        });
    }
    redirect(path, statusCode = 301, requestOptions = {
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
    get isFinished() {
        return this.response.finished;
    }
    finish(body, statusCode) {
        return new Promise((resolve, reject) => {
            if (body)
                this.body = body;
            if (statusCode)
                this.statusCode = statusCode;
            if (this.isFinished)
                return reject('Response is already finished.');
            this.response.writeHead(this.statusCode, this.getHeaders);
            if (this.body)
                this.response.write(this.body, () => resolve(this.terminate()));
            else
                resolve(this.terminate());
        });
    }
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
exports.SrvContext = SrvContext;
//# sourceMappingURL=SrvContext.js.map