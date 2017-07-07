import { IncomingMessage, request, RequestOptions, ServerResponse, ServerResponseHeaders } from 'http'

import { PromiseRejectType, PromiseResolveType } from './helpers'

/**
 * A context created when a request is received by the server while listening.
 * All things related to the request and response are found in `this`.
 * The native http.Server request can be found at `this.request`.
 * Middlewares and handlers modify this (especially `this.statusCode` and `this.body`).
 */
export class Context {
  /**
   * The Date this context was created on.
   */
  readonly createdOn: number = Date.now()

  /**
   * Response body.
   */
  body: Buffer | string | any = null

  /**
   * Request method.
   */
  get method(): string {
    return this.request.method
  }

  /**
   * Request url.
   */
  get url(): string {
    return this.request.url
  }

  /**
   * Construct a new Context from the native request and response objects.
   * 
   * @param request http.Server's request
   * @param response http.Server's response
   */
  constructor(public request: IncomingMessage, private response: ServerResponse) {}

  /**
   * Response status code.
   */
  get statusCode(): number {
    return this.response.statusCode
  }
  set statusCode(statusCode: number) {
    this.response.statusCode = statusCode
  }

  // todo check header ???
  /**
   * Response status message.
   */
  get statusMessage(): string {
    return this.response.statusMessage
  }
  set statusMessage(statusMessage: string) {
    this.response.statusMessage = statusMessage
  }
  
  // todo check header ???
  /**
   * Send date on response?
   */
  get sendDate(): boolean {
    return this.response.sendDate
  }
  set sendDate(value: boolean) {
    this.response.sendDate = value
  }

  /**
   * Get response headers.
   */
  get headers(): ServerResponseHeaders {
    return this.response.getHeaders()
  }

  /**
   * Returns all response header names.
   */
  get headerNames(): string[] {
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
   * Sets timeout on the response.
   * 
   * @param milliseconds Timeout milliseconds
   */
  async setTimeout(milliseconds: number): Promise<Context> {
    return new Promise<Context>((resolve: PromiseResolveType<Context>, reject: PromiseRejectType): void => {
      this.response.setTimeout(milliseconds, (): any => resolve(this))
    })
  }

  /**
   * Finishes the response by requesting and receiving the response from a new path.
   *
   * @beta This feature has not been properly tested yet.
   *
   * @param path New path
   * @param statusCode Response status code
   * @param requestOptions Redirected request options
   */
  async redirect(
    path: string,
    statusCode: number = 301,
    requestOptions: RequestOptions = {
      protocol: 'http:',
      headers: this.response.getHeaders(),
      method: this.request.method,
      path: path
    }
  ): Promise<Context> { // todo: test this, find its best implementation and remove the beta tag
    return new Promise<Context>((resolve: PromiseResolveType<Context>, reject: PromiseRejectType): void => {
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
   * Is the response finished?
   */
  get finished(): boolean {
    return this.response.finished
  }

  /**
   * Ends the response after writing the response body.
   * 
   * @param body Overriding response body
   * @param statusCode Overriding status code
   */
  finish(body?: any, statusCode?: number): Promise<Context> {
    return new Promise<Context>((resolve: PromiseResolveType<Context>, reject: PromiseRejectType): void => {
      if (body)
        this.body = body
      
      if (statusCode)
        this.statusCode = statusCode

      if (this.finished)
        return reject(new Error('Response is already finished.'))
      
      this.response.writeHead(this.statusCode, this.headers)

      if (this.body)
        this.response.write(this.body, (): any => resolve(this.terminate()))
      else
        resolve(this.terminate())
    })
  }

  /**
   * Ends the response without writing the response body.
   * 
   * @param statusCode Overriding status code
   */
  terminate(statusCode?: number): Promise<Context> {
    return new Promise<Context>((resolve: PromiseResolveType<Context>, reject: PromiseRejectType): void => {
      if (statusCode)
        this.statusCode = statusCode
      
      this.response.end((): any => {
        this.response.finished = true
        resolve(this)
      })
    })
  }
}
