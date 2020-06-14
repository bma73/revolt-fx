import { Particle } from "../Particle";
import { BaseEmitterCore } from "./BaseEmitterCore";
export declare class BoxEmitterCore extends BaseEmitterCore {
    constructor();
    emit(particle: Particle): void;
}
