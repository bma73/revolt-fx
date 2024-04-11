import { Particle } from "../Particle";
import { BaseEmitterCore } from "./BaseEmitterCore";
export declare class RingEmitterCore extends BaseEmitterCore {
    private _uniformStep;
    private _angle;
    constructor();
    prepare(spawnCount: number): void;
    emit(particle: Particle): void;
}
