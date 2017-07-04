import { SrvContext } from './SrvContext';
export declare abstract class SrvMiddlewareBlueprint {
    ctx: SrvContext;
    abstract main(): void;
}
