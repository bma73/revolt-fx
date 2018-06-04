import { ICircleCoreParams, IBoxCoreParams, IRingCoreParams } from "../RevoltEffects";
import { ParticleEmitter } from "../ParticleEmitter";
import { Particle } from "../Particle";
export declare class BaseEmitterCore {
    emitter: ParticleEmitter;
    x: number;
    y: number;
    protected _settings: ICircleCoreParams | IBoxCoreParams | IRingCoreParams;
    protected _dx: number;
    protected _dy: number;
    protected _rotation: number;
    constructor(emitter: ParticleEmitter);
    emit(particle: Particle): void;
    rotation: number;
    prepare(): void;
    step(): void;
    dispose(): void;
}
