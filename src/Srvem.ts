import { createServer, IncomingMessage, ServerResponse, Server } from 'http'

import { SrvContext } from './SrvContext'
import { SrvMiddlewareBlueprint } from './SrvMiddlewareBlueprint'

/**
 * `Srvem` (pronounced "serve 'em") is a super-fast and minimalist
 * middleware-oriented TypeScript server for Node.js.  
 *   
 * _Example:_
 * ```
 * import { Srvem } from '@srvem/app'
 * 
 * const app = new Srvem()
 * 
 * // app.use( middleware1 )
 * // app.use( middleware2, middleware3 ) // ...
 * // app.handle( handlerFunc4 )
 * // app.handle( handler5, handler6, handler7 ) // ...
 * 
 * app.ready().listen(80)
 * 
 * ```  
 *   
 * The `Server` created using `.ready()` above will listen on port 80.
 */
export class Srvem {
  private middleware: SrvMiddlewareBlueprint[] = []
  private i: number = null; // a looper

  /**
   * The Server (null if not ready).
   */
  server: Server = null

  /**
   * Constructs a new Srvem application.
   */
  constructor() {}

  /**
   * Adds middleware(s) to be executed, with order,
   * whenever the Srvem server recieves a request.
   * @param middleware Srvem middleware(s)
   */
  use(...middleware: SrvMiddlewareBlueprint[]): void {
    for (const m of middleware)
      this.middleware.push(m);
  }

  /**
   * Adds request handler callback function(s), set to be executed,
   * with order, whenever the Srvem server recieves a request.
   * @param handlers Callback function that handles requests like a middleware.
   */
  handle(...handlers: ((ctx: SrvContext) => void)[]): void {
    for (const handler of handlers) {
      const m: SrvMiddlewareBlueprint = new (class M extends SrvMiddlewareBlueprint {
        main() {
          return handler(this.ctx)
        }
      })()

      this.middleware.push(m);
    }
  }

  /**
   * Creates and returns a Server (using Node.js' built-in 'http'
   * module) after loading all the middlewares and handlers.  
   * You may call the `.listen()` function on the returned object.
   */
  ready(): Server {
    return this.server = createServer((request: IncomingMessage, response: ServerResponse): void => {
      const ctx: SrvContext = new SrvContext(request, response)

      this.i = -1;
      this._runNext(ctx)
      .then((ctx: SrvContext): SrvContext | PromiseLike<SrvContext> => this.i = null)
    })
  }

  private _runNext(ctx: SrvContext): Promise<SrvContext> {
    return new Promise<SrvContext>(
      (resolve: (value?: SrvContext | PromiseLike<SrvContext>) => void, reject: (reason?: any) => void): void => {
        if (this.i === null)
          return resolve(ctx)
        
        if (this.middleware[++this.i])
          this.middleware[this.i].main(ctx)
          .then((newerCtx: SrvContext): SrvContext | PromiseLike<SrvContext> => this._runNext(newerCtx ? newerCtx : ctx))
        else {
          ctx.finish()
          resolve(ctx)
        }
      }
    )
  }
}
