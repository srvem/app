"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SrvContext {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.body = null;
        this.headers = this.response.getHeaders();
        this.statusCode = this.response.statusCode;
        this.statusMessage = this.response.statusMessage;
        this.defaultEncoding = this.request.headers['encoder'].toString() || 'UTF-8';
        this.sendDate = this.response.sendDate;
    }
    setTimeout(milliseconds) {
        return new Promise((resolve, reject) => {
            this.response.setTimeout(milliseconds, () => resolve());
        });
    }
    isFinished() {
        return this.response.finished;
    }
    terminate() {
        this._setResponsePropertiesBack();
        return this._terminate();
    }
    _terminate() {
        return new Promise((resolve, reject) => {
            this.response.end(() => resolve(this.response.finished = true));
        });
    }
    finish() {
        return new Promise((resolve, reject) => {
            if (this.isFinished())
                throw new Error('Response is already finished.');
            this._setResponsePropertiesBack();
            this.response.addTrailers(this.headers);
            this.response.writeHead(this.statusCode, this.headers);
            this.response.write(this.body, this.defaultEncoding, () => resolve(this._terminate()));
        });
    }
    _setResponsePropertiesBack() {
        this.response.statusCode = this.statusCode;
        this.response.statusMessage = this.statusMessage;
        this.response.setDefaultEncoding(this.defaultEncoding);
        this.response.sendDate = this.sendDate;
    }
    hasHeader(name) {
        return !!this.headers[name];
    }
    getHeaderNames() {
        const names = [];
        for (const name in this.headers)
            names.push(name);
        return names;
    }
    getHeader(name) {
        if (this.hasHeader(name))
            return this.headers[name];
        else
            return null;
    }
    setHeader(name, value) {
        this.headers[name] = value;
    }
    removeHeader(name) {
        if (this.hasHeader(name))
            return !!delete this.headers[name];
        else
            return false;
    }
}
exports.SrvContext = SrvContext;
//# sourceMappingURL=SrvContext.js.map