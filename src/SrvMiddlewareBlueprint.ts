import { SrvContext } from './SrvContext'

/**
 * TODO
 */
export abstract class SrvMiddlewareBlueprint {
  /**
   * TODO
   * 
   * @param ctx TODO
   */
  abstract async main(ctx: SrvContext): Promise<SrvContext>
}
