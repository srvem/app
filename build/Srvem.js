"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const SrvContext_1 = require("./SrvContext");
const SrvMiddlewareBlueprint_1 = require("./SrvMiddlewareBlueprint");
class Srvem {
    constructor() {
        this.middleware = [];
        this.i = -1;
        this.server = null;
    }
    use(...middleware) {
        this.middleware = this.middleware.concat(middleware);
    }
    handle(...handlers) {
        for (const handler of handlers)
            this.middleware.push(new (class M extends SrvMiddlewareBlueprint_1.SrvMiddlewareBlueprint {
                async main(ctx) {
                    return handler(ctx);
                }
            })());
    }
    ready() {
        return this.server = http_1.createServer((request, response) => {
            const ctx = new SrvContext_1.SrvContext(request, response);
            this._runNext(ctx)
                .then((ctx) => {
                this.i = -1;
                return ctx;
            })
                .catch((reason) => {
                console.error(`srvem middleware error: ${reason}`);
                this.i = -1;
                return null;
            });
        });
    }
    _runNext(ctx) {
        return new Promise((resolve, reject) => {
            if (this.middleware[++this.i])
                this.middleware[this.i].main(ctx)
                    .then((newerCtx) => {
                    resolve(this._runNext(newerCtx));
                    return newerCtx;
                })
                    .catch((reason) => {
                    reject(reason);
                    return null;
                });
            else
                ctx.finish()
                    .then((lastCtx) => {
                    resolve(lastCtx);
                    return lastCtx;
                })
                    .catch((reason) => {
                    reject(reason);
                    return null;
                });
        });
    }
}
exports.Srvem = Srvem;
//# sourceMappingURL=Srvem.js.map