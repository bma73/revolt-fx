import { ComponentType } from "../ComponentType";
import { EmitterType } from "../core/EmitterType";
import { IBoxCoreParams, ICircleCoreParams, ICoreSettings, IEmitterSettings, IEmitterSpawn, IEmitterSpawns, IMovieClipComponentParams, IMovieClipSettings, IParticleSettings, IRingCoreParams, ISpriteSettings, SpawnType } from "../FX";
import { EasingType } from "../util/Easing";

export class EmitterSettingsData implements IEmitterSettings {
    constructor(public name: string) {
        this.id = name;
    }
    __isClone: boolean = false;
    core: ICoreSettings = {
        type: EmitterType.Circle,
        params: {
            radius: 100,
            radial: true,
            angle: 6.28318530718,
            uniform: false,
            width: 100,
            height: 100
        }
    };
    spawnFrequencyMin: number = 0.1;
    spawnFrequencyMax: number = 0.1;
    particleSettings: IParticleSettings;
    maxParticles: number = 1000;
    spawnCountMin: number = 1;
    spawnCountMax: number = 1;
    duration: number = 0;
    infinite: boolean = true;
    useGravity: boolean = false;
    gravity: number = 0;
    useFloor: boolean = false;
    floorY: number = 0;
    rotation: number = 0;
    autoRotation: number = 0;
    childs: IEmitterSpawn[];
    id: any;
    containerId: string = '';
}

export class EmitterSpawnData implements IEmitterSpawn {
    id: string;
    type: SpawnType = SpawnType.ParticleEmitter;
    scale: number = 1;
    adoptRotation: boolean = false;
    containerId: string;
    constructor(public name: string) {
        this.id = name;
    }
}

export class EmitterSpawnsData implements IEmitterSpawns {
    [Symbol.iterator](): Iterator<IEmitterSpawn[], any, undefined> {
        return this[Symbol.iterator]();
    }

    onStart: IEmitterSpawn[] = [];
    onHalfway: IEmitterSpawn[] = [];
    onBounce: IEmitterSpawn[] = [];
    onComplete: IEmitterSpawn[] = [];
}

export class SpriteSettingsData implements ISpriteSettings {
    anchorX: number = 0.5;
    anchorY: number = 0.5;
    constructor(public texture: string) { }
}

export class MovieClipSettingsData implements IMovieClipSettings {
    anchorX: number = 0.5;
    anchorY: number = 0.5;
    constructor(public textures: string[]) { }
}

export class CircleCoreData implements ICoreSettings {

    type: EmitterType = EmitterType.Circle;
    params: CircleCoreParamsData = new CircleCoreParamsData();
}

export class CircleCoreParamsData implements ICircleCoreParams {
    radius: number = 100;
    radial: boolean = true;
    angle: number = 0;
}

export class RingCoreData implements ICoreSettings {

    type: EmitterType = EmitterType.Ring;
    params: RingCoreParamsData = new RingCoreParamsData();
}

export class RingCoreParamsData implements IRingCoreParams {
    radius: number = 100;
    radial: boolean = true;
    angle: number = 0;
    uniform: boolean = true;
}

export class BoxCoreData implements ICoreSettings {
    type: EmitterType = EmitterType.Box;
    params: BoxCoreParamsData = new BoxCoreParamsData();
}

export class BoxCoreParamsData implements IBoxCoreParams {
    width: number = 100;
    height: number = 100;
    radial: boolean = true;
}

export class ComponentParamsData implements IMovieClipComponentParams {
    animationSpeedMin: number = 1;
    animationSpeedMax: number = 1;
    loop: boolean = true;
    anchorX: number = 0.5;
    anchorY: number = 0.5;
}

export class ParticleSettingsData implements IParticleSettings {
    componentType: ComponentType = ComponentType.Sprite;
    componentParams: ComponentParamsData = new ComponentParamsData();
    durationMin: number = 1;
    durationMax: number = 1;
    useMotion: boolean = false;
    useRotation: boolean = false;
    useAlpha: boolean = false;
    useScale: boolean = false;
    useTint: boolean = false;
    useChilds: boolean = false;
    useSpawns: boolean = false;
    distanceMin: number = 0;
    distanceMax: number = 0;
    distanceEase: EasingType = EasingType.Linear;
    moveSpeedMin: number = 0;
    moveSpeedMax: number = 0;
    bounceFacMin: number = 1;
    bounceFacMax: number = 1;
    frictionMin: number = 0;
    frictionMax: number = 0;
    align: boolean = false;
    blendMode: number | String = 0;
    addOnTop: boolean = false;
    rotationSpeedMin: number = 0;
    rotationSpeedMax: number = 0;
    randomRotationDirection: boolean = false;
    randomStartRotation: boolean = false;
    fadeIn: boolean = false;
    fadeInDurationFac: number = 0;
    fadeInEase: string = EasingType.Linear;
    alphaStartMin: number = 1;
    alphaStartMax: number = 1;
    alphaEndMin: number = 1;
    alphaEndMax: number = 1;
    alphaEase: string = EasingType.Linear;
    tintStart: number = 0xffffff;
    tintEnd: number = 0xffffff;
    tintEase: string = EasingType.Linear;
    scaleIn: boolean = false;
    scaleInDurationFac: number = 1;
    scaleInEase: string = EasingType.Linear;
    uniformScale: boolean = true;
    scaleXStartMin: number = 1;
    scaleXStartMax: number = 1;
    scaleXEndMin: number = 1;
    scaleXEndMax: number = 1;
    scaleXEase: string = EasingType.Linear;
    scaleYStartMin: number = 1;
    scaleYStartMax: number = 1;
    scaleYEndMin: number = 1;
    scaleYEndMax: number = 1;
    scaleYEase: string = EasingType.Linear;
    scaleStartMin: number = 1;
    scaleStartMax: number = 1;
    scaleEndMin: number = 1;
    scaleEndMax: number = 1;
    scaleEase: string = EasingType.Linear;
    stopOnBounce: boolean = false;
    spawn: IEmitterSpawns = new EmitterSpawnsData();
    childs: IEmitterSpawn[];

    constructor(public componentId: string) {
    }
}