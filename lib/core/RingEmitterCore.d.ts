import { BaseEmitterCore } from "./BaseEmitterCore";
import { ParticleEmitter } from "../ParticleEmitter";
import { Particle } from "../Particle";
export declare class RingEmitterCore extends BaseEmitterCore {
    private _uniformStep;
    private _angle;
    constructor(emitter: ParticleEmitter);
    emit(particle: Particle): void;
    prepare(): void;
    step(): void;
}
