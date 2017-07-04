"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const SrvContext_1 = require("./SrvContext");
const SrvMiddlewareBlueprint_1 = require("./SrvMiddlewareBlueprint");
class Srvem {
    constructor() {
        this.middleware = [];
        this.server = null;
    }
    use(...middleware) {
        for (const m of middleware)
            this.middleware.push(m);
    }
    handle(...handlers) {
        for (const handler of handlers) {
            const m = new (class M extends SrvMiddlewareBlueprint_1.SrvMiddlewareBlueprint {
                main() {
                    return handler(this.ctx);
                }
            })();
            this.middleware.push(m);
        }
    }
    ready() {
        return this.server = http_1.createServer((request, response) => {
            const ctx = new SrvContext_1.SrvContext(request, response);
            for (const m of this.middleware) {
                m.ctx = ctx;
                m.main();
            }
            ctx.finish();
        });
    }
}
exports.Srvem = Srvem;
//# sourceMappingURL=Srvem.js.map