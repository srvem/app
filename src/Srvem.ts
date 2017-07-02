import { SrvMiddleware } from '@srvem/middleware'
import { createServer, IncomingMessage, Server, ServerResponse } from 'http'

export class Srvem {
  private middleware: SrvMiddleware[] = []
  server: Server

  use(middleware: SrvMiddleware) {
    this.middleware.push(middleware)
  }

  private callback(): (request: IncomingMessage, response: ServerResponse) => void {
    return (request: IncomingMessage, response: ServerResponse) => {
      this.middleware.forEach((m: SrvMiddleware) => {
        m.request = request
        m.response = response

        m.main()
      })
    }
  }

  start(): Server {
    return this.server = createServer(this.callback())
  }
}
