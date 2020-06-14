/// <reference types="pixi.js" />
import { ParticleEmitter } from "./ParticleEmitter";
import { BaseEffect } from "./BaseEffect";
import { EffectSequence } from "./EffectSequence";
import { Sprite } from "./Sprite";
import { Particle } from "./Particle";
import { BaseEmitterCore } from "./core/BaseEmitterCore";
import { MovieClip } from "./MovieClip";
declare enum ComponentType {
    Sprite = 0,
    MovieClip = 1
}
declare enum EffectSequenceComponentType {
    Sprite = 0,
    MovieClip = 1,
    Emitter = 2,
    Trigger = 3
}
export declare class FX {
    static settingsVersion: number;
    static readonly version: string;
    private static _bundleHash;
    useBlendModes: boolean;
    particleCount: number;
    emitterCount: number;
    effectSequenceCount: number;
    maxParticles: number;
    particleFac: number;
    fix: any;
    private _active;
    private _timeElapsed;
    private _cache;
    private _settingsCache;
    private _nameMaps;
    private _effects;
    __containers: {
        [key: string]: PIXI.Container;
    };
    static ComponentType: any;
    static EffectSequenceComponentType: any;
    static __emitterCores: any;
    constructor();
    start(): void;
    pause(): void;
    update(delta?: number): void;
    clearCache(): void;
    setFloorY(value: number): void;
    dispose(): void;
    loadBundleFiles(bundleSettingsUrl: string, spritesheetUrl: string, spritesheetFilter?: string, additionalAssets?: string[] | IAdditionalAsset[]): Promise<IParseSpriteSheetResult>;
    loadBundleZip(zipUrl: any, jszipInstance: any, additionalAssets?: string[] | IAdditionalAsset[]): Promise<IParseSpriteSheetResult>;
    initBundle(bundleSettings: any, clearCache?: boolean): IParseSpriteSheetResult;
    addParticleEmitter(componentId: string, settings: IEmitterSettings): FX;
    addEffectSequence(componentId: string, settings: IEffectSequenceSettings): FX;
    initSprite(componentId: string, settings: ISpriteSettings): FX;
    initMovieClip(componentId: string, settings: IMovieClipSettings): FX;
    getMovieClips(): {
        [key: string]: IMovieClipSettings;
    };
    getSprites(): {
        [key: string]: ISpriteSettings;
    };
    addContainer(key: string, container: PIXI.Container): void;
    getEffectSequence(name: string): EffectSequence;
    getEffectSequenceById(componentId: string): EffectSequence;
    getParticleEmitter(name: string, autoRecycleOnComplete?: boolean, cloneSettings?: boolean): ParticleEmitter;
    getParticleEmitterById(componentId: string, autoRecycleOnComplete?: boolean, cloneSettings?: boolean): ParticleEmitter;
    stopEmitter(emitter: ParticleEmitter, dispose?: boolean): void;
    stopAllEffects(): void;
    parseSpriteSheet(spriteSheet: PIXI.Spritesheet, filter?: string): IParseSpriteSheetResult;
    parseTextureCache(filter?: string): IParseSpriteSheetResult;
    get active(): boolean;
    __addActiveEffect(effect: BaseEffect): void;
    __removeActiveEffect(effect: BaseEffect): void;
    __getSprite(componentId: string): Sprite;
    __getMovieClip(componentId: string): MovieClip;
    __getParticle(): Particle;
    __getEmitterCore(type: string, emitter: ParticleEmitter): BaseEmitterCore;
    __recycleParticle(particle: Particle): void;
    __recycleSprite(componentId: string, object: any): void;
    __recycleMovieClip(componentId: string, object: any): void;
    __recycleEmitter(emitter: ParticleEmitter): void;
    __recycleEffectSequence(effectSequence: EffectSequence): void;
    __recycleEmitterCore(core: BaseEmitterCore): void;
    private parseObject;
}
export interface IBaseEffect {
    name: string;
    id: any;
    type: number;
    containerId: string;
}
export interface IEmitterSettings extends IBaseEffect {
    core: ICoreSettings;
    spawnFrequencyMin: number;
    spawnFrequencyMax: number;
    particleSettings: IParticleSettings;
    maxParticles: number;
    spawnCountMin: number;
    spawnCountMax: number;
    duration: number;
    infinite: boolean;
    useGravity: boolean;
    gravity: number;
    useFloor: boolean;
    floorY: number;
    rotation: number;
    autoRotation: number;
    childs: IEmitterSpawn[];
}
export interface IEmitterSpawn {
    id: string;
    type: number;
    scale: number;
    name: string;
    adoptRotation: boolean;
    containerId: string;
}
export interface IEmitterSpawns {
    onStart: IEmitterSpawn[];
    onHalfway: IEmitterSpawn[];
    onBounce: IEmitterSpawn[];
    onComplete: IEmitterSpawn[];
}
export interface IEffectSequenceSettings extends IBaseEffect {
    effects: IEffectSettings[];
    delay: number;
    scaleMin: number;
    scaleMax: number;
}
export interface IEffectSettings {
    componentId: string;
    componentType: EffectSequenceComponentType;
    delay: number;
    componentParams: IMovieClipComponentParams | IBaseComponentParams;
    scaleMin: number;
    scaleMax: number;
    alphaMin: number;
    alphaMax: number;
    rotationMin: number;
    rotationMax: number;
    blendMode: number;
    tint: number;
    duration: number;
    containerId: string;
    triggerValue: string;
}
export interface ISpriteSettings {
    texture: string;
    anchorX: number;
    anchorY: number;
}
export interface IMovieClipSettings {
    textures: string[];
    anchorX: number;
    anchorY: number;
}
export interface ICoreSettings {
    type: string;
    params: ICircleCoreParams | IRingCoreParams | IBoxCoreParams;
}
export interface ICircleCoreParams {
    radius: number;
    radial: boolean;
    angle: number;
}
export interface IRingCoreParams {
    radius: number;
    radial: boolean;
    angle: number;
    uniform: boolean;
}
export interface IBoxCoreParams {
    width: number;
    height: number;
    radial: boolean;
}
export interface IParticleSettings {
    componentType: ComponentType;
    componentId: string;
    componentParams: IBaseComponentParams;
    durationMin: number;
    durationMax: number;
    useMotion: boolean;
    useRotation: boolean;
    useAlpha: boolean;
    useScale: boolean;
    useTint: boolean;
    useChilds: boolean;
    useSpawns: boolean;
    distanceMin: number;
    distanceMax: number;
    distanceEase: string;
    moveSpeedMin: number;
    moveSpeedMax: number;
    bounceFacMin: number;
    bounceFacMax: number;
    frictionMin: number;
    frictionMax: number;
    align: boolean;
    blendMode: number;
    addOnTop: boolean;
    rotationSpeedMin: number;
    rotationSpeedMax: number;
    randomRotationDirection: boolean;
    randomStartRotation: boolean;
    fadeIn: boolean;
    fadeInDurationFac: number;
    fadeInEase: string;
    alphaStartMin: number;
    alphaStartMax: number;
    alphaEndMin: number;
    alphaEndMax: number;
    alphaEase: string;
    tintStart: number;
    tintEnd: number;
    tintEase: string;
    scaleIn: boolean;
    scaleInDurationFac: number;
    scaleInEase: string;
    uniformScale: boolean;
    scaleXStartMin: number;
    scaleXStartMax: number;
    scaleXEndMin: number;
    scaleXEndMax: number;
    scaleXEase: string;
    scaleYStartMin: number;
    scaleYStartMax: number;
    scaleYEndMin: number;
    scaleYEndMax: number;
    scaleYEase: string;
    scaleStartMin: number;
    scaleStartMax: number;
    scaleEndMin: number;
    scaleEndMax: number;
    scaleEase: string;
    stopOnBounce: boolean;
    spawn: IEmitterSpawns;
    childs: IEmitterSpawn[];
}
export interface IMovieClipComponentParams extends IBaseComponentParams {
    animationSpeedMin: number;
    animationSpeedMax: number;
    loop: boolean;
}
export interface IBaseComponentParams {
    anchorX: number;
    anchorY: number;
}
export interface IParticleEmitterParent {
    __removeChildEmitter(emitter: any): any;
}
export interface IParticle extends IParticleEmitterParent {
    componentId: string;
    init(emitter: ParticleEmitter, def: IParticleSettings, scaleMod?: number): IParticle;
    update(dt: number): any;
    recycle(): any;
    dispose(): any;
}
export interface IParseSpriteSheetResult {
    sprites: string[];
    movieClips: string[];
}
export interface IAdditionalAsset {
    name: string;
    url: string;
}
export {};
