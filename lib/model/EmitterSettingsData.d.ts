import { ComponentType } from "../ComponentType";
import { EmitterType } from "../core/EmitterType";
import { IBoxCoreParams, ICircleCoreParams, ICoreSettings, IEmitterSettings, IEmitterSpawn, IEmitterSpawns, IMovieClipComponentParams, IMovieClipSettings, IParticleSettings, IRingCoreParams, ISpriteSettings, SpawnType } from "../FX";
import { EasingType } from "../util/Easing";
export declare class EmitterSettingsData implements IEmitterSettings {
    name: string;
    constructor(name: string);
    __isClone: boolean;
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
    id: any;
    containerId: string;
}
export declare class EmitterSpawnData implements IEmitterSpawn {
    name: string;
    id: string;
    type: SpawnType;
    scale: number;
    adoptRotation: boolean;
    containerId: string;
    constructor(name: string);
}
export declare class EmitterSpawnsData implements IEmitterSpawns {
    [Symbol.iterator](): Iterator<IEmitterSpawn[], any, undefined>;
    onStart: IEmitterSpawn[];
    onHalfway: IEmitterSpawn[];
    onBounce: IEmitterSpawn[];
    onComplete: IEmitterSpawn[];
}
export declare class SpriteSettingsData implements ISpriteSettings {
    texture: string;
    anchorX: number;
    anchorY: number;
    constructor(texture: string);
}
export declare class MovieClipSettingsData implements IMovieClipSettings {
    textures: string[];
    anchorX: number;
    anchorY: number;
    constructor(textures: string[]);
}
export declare class CircleCoreData implements ICoreSettings {
    type: EmitterType;
    params: CircleCoreParamsData;
}
export declare class CircleCoreParamsData implements ICircleCoreParams {
    radius: number;
    radial: boolean;
    angle: number;
}
export declare class RingCoreData implements ICoreSettings {
    type: EmitterType;
    params: RingCoreParamsData;
}
export declare class RingCoreParamsData implements IRingCoreParams {
    radius: number;
    radial: boolean;
    angle: number;
    uniform: boolean;
}
export declare class BoxCoreData implements ICoreSettings {
    type: EmitterType;
    params: BoxCoreParamsData;
}
export declare class BoxCoreParamsData implements IBoxCoreParams {
    width: number;
    height: number;
    radial: boolean;
}
export declare class ComponentParamsData implements IMovieClipComponentParams {
    animationSpeedMin: number;
    animationSpeedMax: number;
    loop: boolean;
    anchorX: number;
    anchorY: number;
}
export declare class ParticleSettingsData implements IParticleSettings {
    componentId: string;
    componentType: ComponentType;
    componentParams: ComponentParamsData;
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
    distanceEase: EasingType;
    moveSpeedMin: number;
    moveSpeedMax: number;
    bounceFacMin: number;
    bounceFacMax: number;
    frictionMin: number;
    frictionMax: number;
    align: boolean;
    blendMode: number | String;
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
    constructor(componentId: string);
}
