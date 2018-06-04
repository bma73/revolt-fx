import { ParticleEmitter } from "./ParticleEmitter";
import { MovieClip } from "./MovieClip";
import { Sprite } from "./Sprite";
import { Particle } from "./Particle";
import { BaseEffect } from "./BaseEffect";
import { EffectSequence } from "./EffectSequence";
export interface IEmitterSettings {
    core: ICoreSettings;
    spawnFrequency: number;
    particleSettings: IParticleSettings;
    maxParticles?: number;
    spawnCount?: number;
    duration?: number;
    gravity?: number;
    floorY?: number;
}
export interface IEffectSequenceSettings {
    effects: IEffectSettings[];
    delay?: number;
}
export interface IEffectSettings {
    componentId: string;
    componentType: ComponentType;
    componentParams?: IMovieClipComponentParams;
    scaleMin?: number;
    scaleMax?: number;
    alphaMin?: number;
    alphaMax?: number;
    blendMode?: number;
    tint?: number;
    duration?: number;
    delay?: number;
}
export interface ISpriteSettings {
    texture: string;
    anchorX?: number;
    anchorY?: number;
}
export interface IMovieClipSettings {
    textures: string[];
    anchorX?: number;
    anchorY?: number;
}
export interface ICoreSettings {
    clazz: any;
    params?: ICircleCoreParams | IRingCoreParams | IBoxCoreParams;
}
export interface ICircleCoreParams {
    radius: number;
    radial?: boolean;
    angle?: number;
}
export interface IRingCoreParams {
    radius: number;
    radial?: boolean;
    angle?: number;
    uniform?: boolean;
}
export interface IBoxCoreParams {
    width: number;
    height: number;
    radial?: boolean;
}
export interface IParticleSettings {
    componentType: ComponentType;
    componentId: string;
    componentParams?: IMovieClipComponentParams;
    durationMin: number;
    durationMax: number;
    distanceMin: number;
    distanceMax: number;
    distanceEase?: string;
    moveSpeedMin?: number;
    moveSpeedMax?: number;
    bounceFacMin?: number;
    bounceFacMax?: number;
    blendMode?: number;
    rotationSpeedMin?: number;
    rotationSpeedMax?: number;
    randomRotationDirection?: boolean;
    randomStartRotation?: boolean;
    alphaStartMin?: number;
    alphaStartMax?: number;
    alphaEndMin?: number;
    alphaEndMax?: number;
    alphaEase?: string;
    tintStart?: number;
    tintEnd?: number;
    tintEase?: string;
    scaleStartMin?: number;
    scaleStartMax?: number;
    scaleEndMin?: number;
    scaleEndMax?: number;
    scaleEase?: string;
    spawnOnCompleteEmitterId?: string;
}
export interface IMovieClipComponentParams {
    animationSpeedMin?: number;
    animationSpeedMax?: number;
    loop?: boolean;
}
export interface IParticle {
    componentId: string;
    init(emitter: ParticleEmitter, def: IParticleSettings): void;
    update(dt: number): void;
    recycle(): void;
    dispose(): void;
}
export interface IParseSpriteSheetResult {
    sprites: string[];
    movieClips: string[];
}
export declare enum ComponentType {
    Sprite = 0,
    MovieClip = 1,
    Emitter = 2,
}
export declare class RevoltEffects {
    static instance: RevoltEffects;
    particleCount: number;
    private _active;
    private _timeElapsed;
    private _cache;
    private _settingsCache;
    private _effects;
    constructor();
    start(): void;
    stop(): void;
    update(): void;
    clearCache(): void;
    dispose(): void;
    initParticleEmitter(componentId: string, settings: IEmitterSettings): RevoltEffects;
    initEffectSequence(componentId: string, settings: IEffectSequenceSettings): RevoltEffects;
    initSprite(componentId: string, settings: ISpriteSettings): RevoltEffects;
    initMovieClip(componentId: string, settings: IMovieClipSettings): RevoltEffects;
    getEffectSequence(componentId: string): EffectSequence;
    getParticleEmitter(componentId: string): ParticleEmitter;
    getSprite(componentId: string): Sprite;
    getMovieClip(componentId: string): MovieClip;
    stopEmitter(emitter: ParticleEmitter, dispose?: boolean): void;
    parseSpriteSheet(spriteSheet: any): IParseSpriteSheetResult;
    readonly active: boolean;
    __addActiveEffect(effect: BaseEffect): void;
    __getParticle(): Particle;
    __recycleParticle(particle: Particle): void;
    __recycleObject(componentId: string, object: any): void;
    __recycleEffect(effect: BaseEffect): void;
    __recycleEmitter(emitter: ParticleEmitter): void;
    __recycleEffectSequence(effectSequence: EffectSequence): void;
    private __validateEmitterSettings(settings);
    private __validateSpriteSettings(settings);
    private __validateMovieClipSettings(settings);
    private __validateEffectSequenceSettings(settings);
}
