/// <reference types="pixi.js" />
import { BaseEmitterCore } from "./core/BaseEmitterCore";
import { IEmitterSettings } from "./RevoltEffects";
import { Particle } from "./Particle";
import { BaseEffect } from "./BaseEffect";
export declare class ParticleEmitter extends BaseEffect {
    parent: any;
    settings: IEmitterSettings;
    private _particles;
    private _particleCount;
    private _maxParticles;
    private _core;
    constructor(componentId: string);
    init(container: PIXI.Container, autoStart?: boolean): ParticleEmitter;
    start(): ParticleEmitter;
    stop(waitForParticles?: boolean): void;
    update(dt: number): ParticleEmitter;
    spawn(): ParticleEmitter;
    recycle(): void;
    dispose(): void;
    maxParticles: number;
    core: BaseEmitterCore;
    y: number;
    x: number;
    rotation: number;
    __removeParticle(particle: Particle): void;
    __applySettings(value: IEmitterSettings): void;
}
