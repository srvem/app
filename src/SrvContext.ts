import { IncomingMessage, ServerResponse } from 'http'

/**
 * TODO: docs and example
 */
export class SrvContext {
  /**
   * The Date this context was created on.
   */
  createdOn: number = Date.now()

  /**
   * Response body.
   */
  body: Buffer | string | any = null

  /**
   * Response headers.
   */
  headers: any = this.nativeResponse.getHeaders()

  /**
   * Response status code.
   */
  statusCode: number = this.nativeResponse.statusCode

  /**
   * Response status message.
   */
  statusMessage: string = this.nativeResponse.statusMessage

  /**
   * Response default encoding (UTF-8 unless changed).
   */
  defaultEncoding: string = this.request.headers['encoder'].toString() || 'UTF-8' // todo use the proper request header name for encoding
  
  /**
   * Send date on response?
   */
  sendDate: boolean = this.nativeResponse.sendDate

  /**
   * Construct a new SrvContext by passing in the native request and reponse objects.
   * 
   * @param request Node.js' native Server resquest of type IncomingMessage from the 'http' module
   * @param response Node.js' native Server response of type ServerResponse from the 'http' module
   */
  constructor(public request: IncomingMessage, private nativeResponse: ServerResponse) {}

  /**
   * Set timeout on the response.
   * 
   * @param milliseconds Timeout milliseconds
   */
  setTimeout(milliseconds: number): Promise<void> {
    return new Promise<void>(
      (resolve: (value?: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void => {
        this.nativeResponse.setTimeout(milliseconds, (): any => resolve())
      })
  }

  /**
   * Check if the response is finished.
   */
  isFinished(): boolean {
    return this.nativeResponse.finished
  }

  /**
   * Ends the response without writing the response body provided.
   */
  terminate(): Promise<SrvContext> {
    this._setResponsePropertiesBack()
    return this._terminate()
  }

  private _terminate(): Promise<SrvContext> {
    return new Promise<SrvContext>(
      (resolve: (value?: SrvContext | PromiseLike<SrvContext>) => void, reject: (reason?: any) => void): void => {
        this.nativeResponse.end((): any => {
          this.nativeResponse.finished = true
          resolve(this)
        })
      })
  }

  /**
   * Ends the response after writing the response body.
   */
  finish(): Promise<SrvContext> {
    return new Promise<SrvContext>(
      (resolve: (value?: SrvContext | PromiseLike<SrvContext>) => void, reject: (reason?: any) => void): void => {
        if (this.isFinished())
          throw new Error('Response is already finished.')
        
        this._setResponsePropertiesBack()
        this._setHeadersBack()

        this.nativeResponse.writeHead(this.statusCode, this.headers)
        this.nativeResponse.write(this.body, this.defaultEncoding, (): any => resolve(this._terminate()))
      })
  }

  private _setResponsePropertiesBack(): void {
    this.nativeResponse.statusCode = this.statusCode
    this.nativeResponse.statusMessage = this.statusMessage
    this.nativeResponse.setDefaultEncoding(this.defaultEncoding)
    this.nativeResponse.sendDate = this.sendDate
  }

  private _setHeadersBack() {
    for (const name in this.headers)
      this.nativeResponse.setHeader(name, this.headers[name])
  }

  /**
   * Checks if a response header with a provided name exists
   * 
   * @param name Response header name
   */
  hasHeader(name: string): boolean {
    return !!this.headers[name]
  }

  /**
   * Returns all response header names.
   */
  getHeaderNames(): string[] {
    const names: string[] = []
    
    for (const name in this.headers)
      names.push(name)
    
    return names
  }

  /**
   * Gets the value of response header name (returns null if it doesn't exist).
   * 
   * @param name Response header name
   */
  getHeader(name: string): number | string | string[] {
    if (this.hasHeader(name))
      return this.headers[name]
    else
      return null
  }

  /**
   * Sets a value for a response header name.
   * 
   * @param name Response header name
   * @param value Response header value
   */
  setHeader(name: string, value: number | string | string[]): void {
    this.headers[name] = value
  }

  /**
   * Deletes a response header.
   * 
   * @param name Response header name
   */
  removeHeader(name: string): boolean {
    if (this.hasHeader(name))
      return !!delete this.headers[name]
    else
      return false
  }
}
