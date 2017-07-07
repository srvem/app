# @srvem/app
Srvem (pronounced as "serve 'em") is a super-fast and minimalist asynchronous middleware-oriented TypeScript server framework for Node.js.  
This is the core package of Srvem (contains a class used to construct a Srvem app).
  
## Installation
> `npm install --save @srvem/app`
  
## Example
```typescript
import { Srvem } from '@srvem/app'

// create a Srvem app
const app = new Srvem()

// add middleware like:
app.use(new SrvStatic('public'))

// add your custom handlers like:
app.handle(async (ctx: Context): Promise<void> => {
  // greetings?
  if (ctx.method === 'GET' && ctx.url === '/greet') {
    ctx.statusCode = 200
    ctx.body = 'Hello, world!'
  }
})

// listen on port 3000
app.server.listen(3000)

```
  
## API
```typescript
import { IncomingMessage, RequestOptions, Server, ServerResponse, ServerResponseHeaders } http from 'http'



/**
 * Used to create a Srvem app.
 */
declare class Srvem {
  /**
   * The Server.
   */
  readonly server: Server

  /**
   * Constructs a new Srvem application.
   */
  constructor()

  /**
   * Adds middleware to be executed, with order (including handlers),
   * whenever the Srvem server receives a request.
   *
   * @param middleware Srvem middleware
   */
  use(...middleware: MiddlewareBlueprint[]): void
  
  /**
   * Adds request handler callback function(s), set to be executed, with order
   * (including middleware), whenever the Srvem server receives a request.
   *
   * @param handlers Callback function that handles requests like a middleware
   */
  handle(...handlers: ((ctx: Context) => Promise<void>)[]): void
}



/**
 * A context created when a request is received by the server while listening.
 * All things related to the request and response are found in `this`.
 * The native http.Server request can be found at `this.request`.
 * Middlewares and handlers modify this (especially `this.statusCode` and `this.body`).
 */
declare class Context {
  /**
   * http.Server's request
   */
  request: IncomingMessage

  /**
   * The Date this context was created on.
   */
  readonly createdOn: number;

  /**
   * Response body.
   */
  body: Buffer | string | any

  /**
   * Request method.
   */
  readonly method: string

  /**
   * Request url.
   */
  readonly url: string

  /**
   * Construct a new Context from the native request and response objects.
   *
   * @param request http.Server's request
   * @param response http.Server's response
   */
  constructor(request: IncomingMessage, response: ServerResponse)

  /**
   * Response status code.
   */
  statusCode: number

  /**
   * Response status message.
   */
  statusMessage: string

  /**
   * Send date on response?
   */
  sendDate: boolean

  /**
   * Get response headers.
   */
  readonly headers: ServerResponseHeaders

  /**
   * Returns all response header names.
   */
  readonly headerNames: string[]

  /**
   * Checks if a response header with a provided name exists
   *
   * @param name Response header name
   */
  hasHeader(name: string): boolean

  /**
   * Gets the value of response header name (returns null if it doesn't exist).
   *
   * @param name Response header name
   */
  getHeader(name: string): number | string | string[]

  /**
   * Sets a value for a response header name.
   *
   * @param name Response header name
   * @param value Response header value
   */
  setHeader(name: string, value: string | string[]): void

  /**
   * Deletes a response header.
   *
   * @param name Response header name
   */
  removeHeader(name: string): void

  /**
   * Sets timeout on the response.
   *
   * @param milliseconds Timeout milliseconds
   */
  setTimeout(milliseconds: number): Promise<Context>

  /**
   * Finishes the response by requesting and receiving the response from a new path.
   *
   * @beta This feature has not been properly tested yet.
   *
   * @param path New path
   * @param statusCode Response status code
   * @param requestOptions Redirected request options
   */
  redirect(path: string, statusCode?: number, requestOptions?: RequestOptions): Promise<Context>

  /**
   * Is the response finished?
   */
  readonly finished: boolean

  /**
   * Ends the response after writing the response body.
   *
   * @param body Overriding response body
   * @param statusCode Overriding status code
   */
  finish(body?: any, statusCode?: number): Promise<Context>

  /**
   * Ends the response without writing the response body.
   *
   * @param statusCode Overriding status code
   */
  terminate(statusCode?: number): Promise<Context>
}



/**
 * An abstarct super class Srvem middleware inherit.
 */
declare abstract class MiddlewareBlueprint {
  /**
   * Where execution of the middleware begins.
   *
   * @param ctx The Context
   */
  abstract main(ctx: Context): Promise<void>
}



/**
 * Promise resolve type shortcut.
 */
declare type PromiseResolveType<T> = (value?: T | PromiseLike<T>) => void

/**
 * Promise reject type shortcut.
 */
declare type PromiseRejectType = (reason?: any) => void

```
  
## See Also
- [@srvem/static](https://github.com/srvem/static) - A Srvem middleware used to serve static files from a specified directory.
- [@srvem/router](https://github.com/srvem/router) - A Srvem middleware used to develop routers and server APIs with asynchronous request handlers.
  
## Credits
Kaleab S. Melkie _<<kaleabmelkie@gmail.com>>_
  
## License
MIT License  
Copyright &copy; 2017 srvem
  
Made with &#10084; in Addis Ababa.
