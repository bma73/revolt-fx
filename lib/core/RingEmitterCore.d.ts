import { BaseEmitterCore } from "./BaseEmitterCore";
import { Particle } from "../Particle";
export declare class RingEmitterCore extends BaseEmitterCore {
    private _uniformStep;
    private _angle;
    constructor();
    prepare(spawnCount: number): void;
    emit(particle: Particle): void;
}
