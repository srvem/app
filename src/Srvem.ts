import { SrvMiddleware, SrvRequest, SrvResponse } from '@srvem/middleware'
import { createServer, Server } from 'http'

/**
 * `Srvem` (pronounced "serve 'em") is a super-fast and minimalist
 * middleware-oriented TypeScript server for Node.js.  
 *   
 * _Example:_
 * ```
 * import { Srvem } from '@srvem/app'
 * const app = new Srvem()
 * // app.use( middleware1 )
 * // app.use( middleware2, middleware3 ) // ...
 * // app.handle( handlerFunc4 )
 * // app.handle( handler5, handler6, handler7 ) // ...
 * app.start().listen(80)
 * ```  
 *   
 * The `Server` created using `.start()` will listen on port 80.
 */
export class Srvem {
  private middleware: SrvMiddleware[] = []
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
  use(...middleware: SrvMiddleware[]): void {
    for (const m of middleware)
      this.middleware.push(m);
  }

  /**
   * Adds request handler callback function(s), set to be executed,
   * with order, whenever the Srvem server recieves a request.
   * @param handlers Callback function that handles requests like a middleware.
   */
  handle(...handlers: ((request: SrvRequest, response: SrvResponse) => void)[]): void {
    for (const handler of handlers) {
      const m: SrvMiddleware = new (class M extends SrvMiddleware {
        main() {
          return handler(this.request, this.response)
        }
      })()

      this.middleware.push(m);
    }
  }

  /**
   * Creates and returns a Server (using Node.js' built-in 'http' module).  
   * You may call the `.listen()` function on the return value of this funtion.
   */
  start(): Server {
    return this.server = createServer((request: SrvRequest, response: SrvResponse): void => {
      for (const m of this.middleware) {
        m.request = request
        m.response = response

        m.main()
      }
    })
  }
}
