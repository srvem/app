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
  abstract main(ctx: SrvContext): Promise<SrvContext>
}
