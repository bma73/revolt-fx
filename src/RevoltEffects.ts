

import {LinkedList, Node} from "./util/LinkedList";
import {ParticleEmitter} from "./ParticleEmitter";
import {MovieClip} from "./MovieClip";
import {Sprite} from "./Sprite";
import {Particle} from "./Particle";
import {BaseEffect} from "./BaseEffect";
import {EffectSequence} from "./EffectSequence";

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
    params?: ICircleCoreParams |
        IRingCoreParams |
        IBoxCoreParams
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
    // componentTexture?: string | string[];
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

export enum ComponentType {
    Sprite,
    MovieClip,
    Emitter
}

export class RevoltEffects {

    public static instance: RevoltEffects = new RevoltEffects();

    public particleCount: number = 0;

    private _active: boolean = false;
    private _timeElapsed: number;

    private _cache: { [key: string]: any[] } = {};
    private _settingsCache: { [key: string]: { [key: string]: any } } = {};
    private _effects: LinkedList = new LinkedList();


    constructor() {
        this.start();
    }

    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************

    public start() {
        this._active = true;
        this._timeElapsed = Date.now();
    }

    public stop() {
        this._active = false;
    }

    public update() {
        if (!this.active) return;
        let t = Date.now();
        let dt = (t - this._timeElapsed) * 0.001;

        let list = this._effects;
        let node = <BaseEffect>list.first;
        let next;
        while (node) {
            next = <BaseEffect>node.next;
            node.update(dt);
            node = next;
        }
        this._timeElapsed = t;
    }

    public clearCache() {
        this._cache = {};
        this._settingsCache = {};
    }

    public dispose() {
        let list = this._effects;
        let node = <BaseEffect>list.first;
        while (node) {
            node.dispose();
            node = <BaseEffect>node.next;
        }
        list.clear();
        this.clearCache();
    }

    public initParticleEmitter(componentId: string, settings: IEmitterSettings): RevoltEffects {
        if (this._settingsCache[componentId]) throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateEmitterSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    }

    public initEffectSequence(componentId: string, settings: IEffectSequenceSettings): RevoltEffects {
        if (this._settingsCache[componentId]) throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateEffectSequenceSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    }

    public initSprite(componentId: string, settings: ISpriteSettings): RevoltEffects {
        if (this._settingsCache[componentId]) throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateSpriteSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    }

    public initMovieClip(componentId: string, settings: IMovieClipSettings): RevoltEffects {
        if (this._settingsCache[componentId]) throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateMovieClipSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    }

    public getEffectSequence(componentId: string): EffectSequence {
        let cache = this._cache,
            pool = cache[componentId],
            effectSequence: EffectSequence;

        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }

        let settings = <IEffectSequenceSettings>this._settingsCache[componentId];
        if (settings == null) throw new Error('Settings not defined');

        if (pool.length == 0) {
            effectSequence = new EffectSequence(componentId);
        } else {
            effectSequence = pool.pop();
        }
        effectSequence.__applySettings(settings);
        return effectSequence;
    }


    public getParticleEmitter(componentId: string): ParticleEmitter {
        let cache = this._cache,
            pool = cache[componentId],
            emitter;

        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }

        let settings = <IParticleSettings>this._settingsCache[componentId];
        if (settings == null) throw new Error('Settings not defined');

        if (pool.length == 0) {
            emitter = new ParticleEmitter(componentId);
        } else {
            emitter = pool.pop();
        }
        emitter.__applySettings(settings);
        return emitter;
    }

    public getSprite(componentId: string): Sprite {
        let cache = this._cache,
            pool = cache[componentId];

        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }

        if (pool.length == 0) {
            let settings = <ISpriteSettings>this._settingsCache[componentId];
            if (settings == null) throw new Error('Settings not defined');
            return new Sprite(componentId, settings.texture, settings.anchorX, settings.anchorY);
        }
        // console.log('sprite from pool');
        return pool.pop();
    }

    public getMovieClip(componentId: string): MovieClip {
        let cache = this._cache,
            pool = cache[componentId];

        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }

        if (pool.length == 0) {
            let settings = <IMovieClipSettings>this._settingsCache[componentId];
            if (settings == null) throw new Error('Settings not defined');
            return new MovieClip(componentId, settings.textures, settings.anchorX, settings.anchorY);
        }
        return pool.pop();
    }

    public stopEmitter(emitter: ParticleEmitter, dispose: boolean = false) {
        if (emitter.list === this._effects) {
            this._effects.remove(emitter);
        }
        if (dispose) {
            emitter.dispose();
        } else {
            this.__recycleEmitter(emitter);
        }
    }


    public parseSpriteSheet(spriteSheet: any): IParseSpriteSheetResult {
        let frames = spriteSheet.frames;
        let mcs: any = {};
        let result: IParseSpriteSheetResult = {sprites: [], movieClips: []};
        for (let i in frames) {
            this.initSprite(i, {texture: i, anchorX: 0.5, anchorY: 0.5});
            result.sprites.push(i);
            if (i.indexOf('mc') != -1) {
                let parts = i.split('_');
                let group = parts[1];
                if (mcs[group] == null) mcs[group] = [];
                mcs[group].push(i);
            }
        }
        for (let i in mcs) {
            let textures = mcs[i];
            result.movieClips.push(i);
            this.initMovieClip(i, {textures: textures, anchorX: 0.5, anchorY: 0.5});
        }
        return result;
    }

    public get active(): boolean {
        return this._active;
    }

    // *********************************************************************************************
    // * Internal																				   *
    // *********************************************************************************************

    public __addActiveEffect(effect: BaseEffect) {
        this._effects.add(effect);
    }

    public __getParticle(): Particle {
        let cache = this._cache,
            id = '__particles__',
            pool = cache[id];

        if (cache[id] == null) {
            pool = cache[id] = [];
        }

        if (pool.length == 0) {
            return new Particle();
        }
        return pool.pop();
    }

    public __recycleParticle(particle: Particle) {
        // switch (particle.settings.componentType) {
        //     default:
        //         this._cache[particle.componentId].push(particle.component);
        //         particle.component.recycle();
        //         break;
        // }
        // particle.recycle();
        this._cache['__particles__'].push(particle);

        // console.log('cache particles:', this._cache['__particles__'].length, 'sprites:', this._cache['tile'].length);

    }

    public __recycleObject(componentId: string, object: any) {
        this._cache[componentId].push(object);
        // if (object.recycle) object.recycle();
    }

    public __recycleEffect(effect: BaseEffect) {
        if (effect.list === this._effects) {
            this._effects.remove(effect);
        }
        this._cache[effect.componentId].push(effect);
        // effect.recycle();
    }

    public __recycleEmitter(emitter: ParticleEmitter) {
        if (emitter.list === this._effects) {
            this._effects.remove(emitter);
        }
        this._cache[emitter.componentId].push(emitter);
        // emitter.recycle();
    }

    public __recycleEffectSequence(effectSequence: EffectSequence) {
        if (effectSequence.list === this._effects) {
            this._effects.remove(effectSequence);
        }
        this._cache[effectSequence.componentId].push(effectSequence);
        // effectSequence.recycle();
    }

    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************

    private __validateEmitterSettings(settings: IEmitterSettings) {
        settings.spawnFrequency = settings.spawnFrequency || 0.05;
        settings.maxParticles = settings.maxParticles || Number.MAX_VALUE;
        settings.duration = settings.duration || 0;
        settings.spawnCount = settings.spawnCount || 1;
    }

    private __validateSpriteSettings(settings: ISpriteSettings) {
        if (settings.texture == null) throw new Error("Texture name is missing.");
        settings.anchorX = settings.anchorX || 0.5;
        settings.anchorY = settings.anchorY || 0.5;
    }

    private __validateMovieClipSettings(settings: IMovieClipSettings) {
        if (settings.textures == null) throw new Error("Texture names are missing.");
        settings.anchorX = settings.anchorX || 0.5;
        settings.anchorY = settings.anchorY || 0.5;
    }

    private __validateEffectSequenceSettings(settings: IEffectSequenceSettings) {
        if (settings.effects == null) throw new Error("Effect array is missing.");
        for (let e of settings.effects) {
            e.blendMode = e.blendMode || 0;
            e.duration = e.duration || 0.1;
            e.delay = e.delay || 0;
            e.tint = e.tint || 0xffffff;
            e.scaleMax = e.scaleMax || 1;
            e.scaleMin = e.scaleMin || 1;
            e.alphaMax = e.alphaMax || 1;
            e.alphaMin = e.alphaMin || 1;
        }
    }
}



/* export enum EasingType {
 linear,
 InQuad,
 OutQuad,
 InOutQuad,
 InCubic,
 OutCubic,
 InOutCubic,
 InQuart,
 OutQuart,
 InOutQuart,
 InQuint,
 OutQuint,
 InOutQuint,
 InSine,
 OutSine,
 InOutSine,
 InExpo,
 OutExpo,
 InOutExpo,
 InCirc,
 OutCirc,
 InOutCirc,
 InElastic,
 OutElastic,
 InOutElastic,
 InBack,
 OutBack,
 InOutBack,
 InBounce,
 OutBounce,
 InOutBounce
 }*/

