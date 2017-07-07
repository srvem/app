import { Context } from './Context';
/**
 * An abstarct super class Srvem middleware inherit.
 */
export declare abstract class MiddlewareBlueprint {
    /**
     * Where execution of the middleware begins.
     *
     * @param ctx The Context
     */
    abstract main(ctx: Context): Promise<void>;
}
