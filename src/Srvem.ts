import { createServer, IncomingMessage, ServerResponse, Server } from 'http'

import { Context } from './Context'
import { MiddlewareBlueprint } from './MiddlewareBlueprint'

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
export class Srvem {
  /**
   * An array to store middlewares (and handlers that are tranformed into middlewares).
   */
  private middleware: MiddlewareBlueprint[] = []

  /**
   * The Server.
   */
  readonly server: Server

  /**
   * Constructs a new Srvem application.
   */
  constructor() {
    this.server = createServer(async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
      const ctx: Context = new Context(request, response)
      
      for (const m of this.middleware)
        await m.main(ctx)
      
      ctx.finish()
    })
  }

  /**
   * Adds middleware to be executed, with order (including handlers),
   * whenever the Srvem server receives a request.
   * 
   * @param middleware Srvem middleware
   */
  use(...middleware: MiddlewareBlueprint[]): void {
    for (const m of middleware)
      this.middleware.push(m)
  }

  /**
   * Adds request handler callback function(s), set to be executed, with order
   * (including middleware), whenever the Srvem server receives a request.
   * 
   * @param handlers Callback function that handles requests like a middleware
   */
  handle(...handlers: ((ctx: Context) => Promise<void>)[]): void {
    for (const handler of handlers)
      this.middleware.push(new (class M extends MiddlewareBlueprint {
        async main(ctx: Context): Promise<void> {
          return handler(ctx)
        }
      })())
  }
}
