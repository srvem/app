import { Context } from './Context'

/**
 * An abstarct super class Srvem middleware inherit.
 */
export abstract class MiddlewareBlueprint {
  /**
   * Where execution of the middleware begins.
   * 
   * @param ctx The Context
   */
  abstract async main(ctx: Context): Promise<void>
}
