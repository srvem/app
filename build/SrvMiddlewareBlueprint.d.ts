import { SrvContext } from './SrvContext';
export declare abstract class SrvMiddlewareBlueprint {
    abstract main(ctx: SrvContext): Promise<SrvContext>;
}
