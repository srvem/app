import { IncomingMessage, request, RequestOptions, ServerResponse, ServerResponseHeaders } from 'http'

/**
 * A context created when a request is received while listening on the server.
 * All things related to the response are found in this.
 * All things related to the request are found in this.request.
 * This will be sent to middleware and handlers that Promise it's type back (after modification).
 * Note: this.body is the response that will be written at the end.
 *
 * WARNING: If you are developing a middleware or a handler, do not loose the ctx: SrvContext.
 * Without it, there will be no response for the request received by the server.
 * Just remember to resolve your Promise.
 */
export class SrvContext {
  /**
   * The Date this context was created on.
   */
  readonly createdOn: number = Date.now()

  /**
   * Response body.
   */
  body: Buffer | string | any = null

  /**
   * Construct a new SrvContext by passing in the native request and response objects.
   * 
   * @param request Node.js' native Server request of type IncomingMessage from the 'http' module
   * @param response Node.js' native Server response of type ServerResponse from the 'http' module
   */
  constructor(public request: IncomingMessage, private response: ServerResponse) {}

  /**
   * Get response status code.
   */
  get statusCode(): number {
    return this.response.statusCode
  }

  /**
   * Set response status code.
   */
  set statusCode(statusCode: number) {
    this.response.statusCode = statusCode
  }

  /**
   * Get response status message.
   */
  get statusMessage(): string {
    return this.response.statusMessage
  }

  /**
   * Set response status message.
   */
  set statusMessage(statusMessage: string) {
    this.response.statusMessage = statusMessage
  }
  
  /**
   * Get: send date on response?
   */
  get sendDate(): boolean {
    return this.response.sendDate
  }
  
  /**
   * Get: send date on response?
   */
  set sendDate(value: boolean) {
    this.response.sendDate = value
  }

  /**
   * Get response headers.
   */
  get getHeaders(): ServerResponseHeaders {
    return this.response.getHeaders()
  }

  /**
   * Returns all response header names.
   */
  get getHeaderNames(): string[] {
    return this.response.getHeaderNames()
  }

  /**
   * Checks if a response header with a provided name exists
   * 
   * @param name Response header name
   */
  hasHeader(name: string): boolean {
    return this.response.hasHeader(name)
  }

  /**
   * Gets the value of response header name (returns null if it doesn't exist).
   * 
   * @param name Response header name
   */
  getHeader(name: string): number | string | string[] {
    return this.response.getHeader(name)
  }

  /**
   * Sets a value for a response header name.
   * 
   * @param name Response header name
   * @param value Response header value
   */
  setHeader(name: string, value: string | string[]): void {
    return this.response.setHeader(name, value)
  }

  /**
   * Deletes a response header.
   * 
   * @param name Response header name
   */
  removeHeader(name: string): void {
    return this.response.removeHeader(name)
  }

  /**
   * Set timeout on the response.
   * 
   * @param milliseconds Timeout milliseconds
   */
  setTimeout(milliseconds: number): Promise<SrvContext> {
    return new Promise<SrvContext>((resolve: (value?: SrvContext | PromiseLike<SrvContext>) => void, reject: (reason?: any) => void): void => {
      this.response.setTimeout(milliseconds, (): any => resolve(this))
    })
  }

  /**
   * Finishes the response by requesting and receiving the response from a new path.
   *
   * @beta This feature has not been tested properly yet.
   *
   * @param path New path
   * @param statusCode Response status code
   * @param requestOptions Redirected request options
   */
  redirect(
    path: string,
    statusCode: number = 301,
    requestOptions: RequestOptions = {
      protocol: 'http:',
      headers: this.response.getHeaders(),
      method: this.request.method,
      path: path
    }
  ): Promise<SrvContext> { // todo: test this, find its best implementation and remove the beta tag
    return new Promise<SrvContext>((resolve: (value?: SrvContext | PromiseLike<SrvContext>) => void, reject: (reason?: any) => void): void => {
      request(requestOptions, (response: IncomingMessage): void => {
        response.on('error', (err: Error): void => reject(err))

        let newBody: string = ''
        response.on('data', (chunk: string | Buffer): void => {
          newBody += chunk
        })

        response.on('end', (): void => resolve(this.finish(newBody, statusCode)))
      })
    })
  }

  /**
   * Check if the response is finished.
   */
  get isFinished(): boolean {
    return this.response.finished
  }

  /**
   * Ends the response after writing the response body.
   */
  finish(body?: any, statusCode?: number): Promise<SrvContext> {
    return new Promise<SrvContext>((resolve: (value?: SrvContext | PromiseLike<SrvContext>) => void, reject: (reason?: any) => void): void => {
      if (body)
        this.body = body
      
      if (statusCode)
        this.statusCode = statusCode

      if (this.isFinished)
        return reject('Response is already finished.')
      
      this.response.writeHead(this.statusCode, this.getHeaders)

      if (this.body)
        this.response.write(this.body, (): any => resolve(this.terminate()))
      else
        resolve(this.terminate())
    })
  }

  /**
   * Ends the response without writing the response body provided.
   */
  terminate(statusCode?: number): Promise<SrvContext> {
    return new Promise<SrvContext>((resolve: (value?: SrvContext | PromiseLike<SrvContext>) => void, reject: (reason?: any) => void): void => {
      if (statusCode)
        this.statusCode = statusCode
      
      this.response.end((): any => {
        this.response.finished = true
        resolve(this)
      })
    })
  }
}
