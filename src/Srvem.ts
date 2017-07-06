import { createServer, IncomingMessage, ServerResponse, Server } from 'http'

import { SrvContext } from './SrvContext'
import { SrvMiddlewareBlueprint } from './SrvMiddlewareBlueprint'

/**
 * `Srvem` (pronounced "serve 'em") is a super-fast and minimalist middleware-oriented
 * and Promise-based asynchronous TypeScript server for Node.js.  
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
  private i: number = null; // a looper through the middlewares

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
    this.middleware.concat(middleware)
  }

  /**
   * Adds request handler callback function(s), set to be executed,
   * with order, whenever the Srvem server recieves a request.
   * @param handlers Callback function that handles requests like a middleware.
   */
  handle(...handlers: ((ctx: SrvContext) => Promise<SrvContext>)[]): void {
    for (const handler of handlers)
      this.middleware.push(new (class M extends SrvMiddlewareBlueprint {
        async main(ctx: SrvContext): Promise<SrvContext> {
          return handler(ctx)
        }
      })())
  }

  /**
   * Creates and returns a Server (using Node.js' built-in 'http'
   * module) after loading all the middlewares and handlers.  
   * You may call the `.listen()` function on the returned object.
   */
  ready(): Server {
    return this.server = createServer((request: IncomingMessage, response: ServerResponse): void => {
      const ctx: SrvContext = new SrvContext(request, response)

      this._runNext(ctx)
        .then((ctx: SrvContext): SrvContext | PromiseLike<SrvContext> => {
          this.i = -1
          return ctx
        })
        .catch((reason: any): never | PromiseLike<never> => {
          console.error(`srvem middleware error: ${reason}`)
          this.i = -1
          return null
        })
    })
  }

  private _runNext(ctx: SrvContext): Promise<SrvContext> {
    return new Promise<SrvContext>((resolve: (value?: SrvContext | PromiseLike<SrvContext>) => void, reject: (reason?: any) => void): void => {
      if (this.middleware[++this.i])
        this.middleware[this.i].main(ctx)
          .then((newerCtx: SrvContext): SrvContext | PromiseLike<SrvContext> => this._runNext(newerCtx ? newerCtx : ctx))
          .catch((reason: any): never | PromiseLike<never> => {
            reject(reason)
            return null
          })
      else
        ctx.finish()
          .then((lastCtx: SrvContext): SrvContext | PromiseLike<SrvContext> => {
            resolve(lastCtx)
            return lastCtx
          })
          .catch((reason: any): never | PromiseLike<never> => {
            reject(reason)
            return null
          })
    })
  }
}
