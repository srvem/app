"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const Context_1 = require("./Context");
const MiddlewareBlueprint_1 = require("./MiddlewareBlueprint");
/**
 * Used to create a Srvem app.
 *
 * @example A Simple Srvem App:
 *
 * ```
 * // create a Srvem app
 * const app = new Srvem()
 *
 * // add middleware like:
 * app.use(new SrvStatic('public'))
 *
 * // add your custom handlers like:
 * app.handle(async (ctx: Context): Promise<void> => {
 *   // greetings?
 *   if (ctx.method === 'GET' && ctx.url === '/greet') {
 *     ctx.statusCode = 200
 *     ctx.body = 'Hello, world!'
 *   }
 * })
 *
 * // listen on port 3000
 * app.server.listen(3000)
 *
 * ```
 */
class Srvem {
    /**
     * Constructs a new Srvem application.
     */
    constructor() {
        /**
         * An array to store middlewares (and handlers that are tranformed into middlewares).
         */
        this.middleware = [];
        this.server = http_1.createServer(async (request, response) => {
            const ctx = new Context_1.Context(request, response);
            for (const m of this.middleware)
                await m.main(ctx);
            ctx.finish();
        });
    }
    /**
     * Adds middleware to be executed, with order (including handlers),
     * whenever the Srvem server receives a request.
     *
     * @param middleware Srvem middleware
     */
    use(...middleware) {
        for (const m of middleware)
            this.middleware.push(m);
    }
    /**
     * Adds request handler callback function(s), set to be executed, with order
     * (including middleware), whenever the Srvem server receives a request.
     *
     * @param handlers Callback function that handles requests like a middleware
     */
    handle(...handlers) {
        for (const handler of handlers)
            this.middleware.push(new (class M extends MiddlewareBlueprint_1.MiddlewareBlueprint {
                async main(ctx) {
                    return handler(ctx);
                }
            })());
    }
}
exports.Srvem = Srvem;
//# sourceMappingURL=Srvem.js.map