/// <reference types="pixi.js" />
/// <reference types="jszip" />

import {ParticleEmitter} from "./ParticleEmitter";
import {LinkedList} from "./util/LinkedList";
import {RingEmitterCore} from "./core/RingEmitterCore";
import {CircleEmitterCore} from "./core/CircleEmitterCore";
import {BoxEmitterCore} from "./core/BoxEmitterCore";
import {BaseEffect} from "./BaseEffect";
import {EffectSequence} from "./EffectSequence";
import {Sprite} from "./Sprite";
import {Particle} from "./Particle";
import {BaseEmitterCore} from "./core/BaseEmitterCore";
import {MovieClip} from "./MovieClip";
import {Sanitizer} from "./Sanitizer";

enum ComponentType {
    Sprite,
    MovieClip
}

enum EffectSequenceComponentType {
    Sprite,
    MovieClip,
    Emitter,
    Trigger
}

export class FX {

    public static settingsVersion: number = 0;
    private static _bundleHash: string = '80c6df7fb0d3d898f34ce0031c037fef';

    public useBlendModes: boolean = true;
    public particleCount: number = 0;
    public emitterCount: number = 0;
    public effectSequenceCount: number = 0;
    public maxParticles: number = 5000;
    public particleFac: number = 1;
    public fix

    private _active: boolean = false;
    private _timeElapsed: number;

    private _cache: any;
    private _settingsCache: any;
    private _nameMaps: any;

    private _effects: LinkedList = new LinkedList();

    public __containers: { [key: string]: PIXI.Container } = {};

    public static ComponentType: any = ComponentType;
    public static EffectSequenceComponentType: any = EffectSequenceComponentType;

    public static __emitterCores: any = {
        circle: CircleEmitterCore,
        box: BoxEmitterCore,
        ring: RingEmitterCore
    };

    constructor() {
        this.clearCache();
        this.start();
    }

    // *********************************************************************************************
    // * Public										                                        											   *
    // *********************************************************************************************

    public start() {
        this._active = true;
        this._timeElapsed = Date.now();
    }

    public pause() {
        this._active = false;
    }

    public update(delta?: number) {
        if (!this.active) return;

        const t = Date.now();
        let dt = (t - this._timeElapsed) * 0.001;

        if (delta !== undefined) dt *= delta;

        const list = this._effects;
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
        this._cache = {
            particles: [],
            mcs: [],
            sprites: [],
            effectSequences: [],
            emitters: [],
            cores: {}
        };
        this._settingsCache = {
            mcs: {},
            sprites: {},
            emitters: {},
            effectSequences: {}
        };
        this._nameMaps = {
            emitters: {},
            effectSequences: {}
        };
    }

    public setFloorY(value: number) {
        const s = this._settingsCache.emitters;
        for (let n in s) {
            s[n].floorY = value;
        }
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

    public loadBundleFiles(bundleSettingsUrl: string, spritesheetUrl: string, spritesheetFilter: string = '', additionalAssets?: string[] | IAdditionalAsset[]): Promise<IParseSpriteSheetResult> {
        return new Promise((resolve, reject) => {
            const loader = new PIXI.loaders.Loader();
            loader.onError.add((err) => {
                reject(err);
            });
            loader
                .add('rfx_spritesheet', spritesheetUrl)
                .add('rfx_bundleSettings', bundleSettingsUrl);

            if (additionalAssets) {
                for (let arg of additionalAssets) {
                    if (arg.hasOwnProperty('name') && arg.hasOwnProperty('url')) {
                        loader.add((<IAdditionalAsset>arg).name, (<IAdditionalAsset>arg).url);
                    } else {
                        loader.add(<string>arg);
                    }
                }
            }

            loader.load((l, d) => {
                resolve(this.initBundle(d.rfx_bundleSettings.data));
            });
        });
    }

    public loadBundleZip(zipUrl, jszipInstance: any, additionalAssets?: string[] | IAdditionalAsset[]): Promise<IParseSpriteSheetResult> {
        return new Promise((resolve, reject) => {
            if (jszipInstance == null) {
                reject('JSZip instance not provided.');
                return;
            }

            const loader = new PIXI.loaders.Loader();
            loader.add('zip', zipUrl, {xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BLOB});

            if (additionalAssets) {
                for (let arg of additionalAssets) {
                    if (arg.hasOwnProperty('name') && arg.hasOwnProperty('url')) {
                        loader.add((<IAdditionalAsset>arg).name, (<IAdditionalAsset>arg).url);
                    } else {
                        loader.add(<string>arg);
                    }
                }
            }

            loader.load(async (l, d) => {
                try {

                    let spritesheetImageData;
                    let spritesheetDef;
                    let settingsDef;

                    await jszipInstance.loadAsync(d.zip.data);

                    const list = [];
                    jszipInstance.forEach((path, entry) => {
                        list.push(entry);
                    });

                    for (let n in list) {
                        const entry = list[n];
                        if (entry.name.indexOf('.png') != -1) {

                            const base64 = await entry.async('base64');
                            spritesheetImageData = `data:image/png;base64,${base64}`;

                        } else if (entry.name.indexOf('.json') != -1) {

                            const s = await entry.async('string');
                            const def = JSON.parse(s);
                            if (def.__h) {
                                if (def.__h !== FX._bundleHash) {
                                    reject('Invalid settings file.');
                                    return;
                                }
                                settingsDef = def;
                            } else if (def.frames) {
                                spritesheetDef = def;
                            }
                        }
                    }
                    const texture = PIXI.Texture.from(spritesheetImageData);
                    const spritesheet = new PIXI.Spritesheet(texture.baseTexture, spritesheetDef);
                    spritesheet.parse(() => {
                        setTimeout(() => {
                            resolve(this.initBundle(settingsDef, true));
                        }, 100);
                    });
                } catch (err) {
                    reject(err.toString());
                }
            });
        });
    }

    public initBundle(bundleSettings: any, clearCache?: boolean): IParseSpriteSheetResult {
        if (bundleSettings.__h !== FX._bundleHash) {
            throw new Error('Invalid settings file.');
        }

        if (bundleSettings.__v != FX.settingsVersion) {
            throw new Error('Settings version mismatch.');
        }

        Sanitizer.sanitizeBundle(bundleSettings);

        if (clearCache) {
            this.clearCache();
        }
        for (let n in bundleSettings.emitters) {
            const preset = bundleSettings.emitters[n];
            this.addParticleEmitter(preset.id, preset);
        }
        for (let n in bundleSettings.sequences) {
            const preset = bundleSettings.sequences[n];
            this.addEffectSequence(preset.id, preset);
        }

        this.useBlendModes = bundleSettings.useBlendModes;
        this.maxParticles = bundleSettings.maxParticles;

        return this.parseTextureCache(bundleSettings.spritesheetFilter);
    }

    public addParticleEmitter(componentId: string, settings: IEmitterSettings): FX {

        if (this._settingsCache.emitters[componentId]) throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.emitters[componentId] = settings;
        this._nameMaps.emitters[settings.name] = settings;
        return this;
    }

    public addEffectSequence(componentId: string, settings: IEffectSequenceSettings): FX {
        if (this._settingsCache.effectSequences[componentId]) throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.effectSequences[componentId] = settings;
        this._nameMaps.effectSequences[settings.name] = settings;
        return this;
    }

    public initSprite(componentId: string, settings: ISpriteSettings): FX {
        if (this._settingsCache.sprites[componentId]) throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.sprites[componentId] = settings;
        return this;
    }

    public initMovieClip(componentId: string, settings: IMovieClipSettings): FX {
        if (this._settingsCache.mcs[componentId]) throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.mcs[componentId] = settings;
        return this;
    }

    public getMovieClips(): { [key: string]: IMovieClipSettings } {
        return this._settingsCache.mcs;
    }

    public getSprites(): { [key: string]: ISpriteSettings } {
        return this._settingsCache.sprites;
    }

    public addContainer(key: string, container: PIXI.Container) {
        this.__containers[key] = container;
    }

    public getEffectSequence(name: string): EffectSequence {
        const settings = this._nameMaps.effectSequences[name];
        if (!settings) throw new Error(`Settings not defined for '${name}'`);
        return this.getEffectSequenceById(settings.id);
    }

    public getEffectSequenceById(componentId: string): EffectSequence {
        const pool = this._cache.effectSequences;
        let effectSequence;

        let settings = <IEffectSequenceSettings>this._settingsCache.effectSequences[componentId];
        if (!settings) throw new Error(`Settings not defined for '${componentId}'`);

        if (pool.length == 0) {
            effectSequence = new EffectSequence(componentId);
            effectSequence.__fx = this;
        } else {
            effectSequence = pool.pop();
        }
        effectSequence.__applySettings(settings);
        return effectSequence;
    }

    public getParticleEmitter(name: string, autoRecycleOnComplete: boolean = true, cloneSettings: boolean = false): ParticleEmitter {
        const settings = this._nameMaps.emitters[name];
        if (!settings) throw new Error(`Settings not defined for '${name}'`);
        return this.getParticleEmitterById(settings.id, autoRecycleOnComplete, cloneSettings);
    }

    public getParticleEmitterById(componentId: string, autoRecycleOnComplete: boolean = true, cloneSettings: boolean = false): ParticleEmitter {
        const pool = this._cache.emitters;
        let emitter;

        let settings = <IParticleSettings>this._settingsCache.emitters[componentId];
        if (!settings) throw new Error(`Settings not defined for '${componentId}'`);

        if (pool.length == 0) {
            emitter = new ParticleEmitter(componentId);
            emitter.__fx = this;
        } else {
            emitter = pool.pop();
        }

        if (cloneSettings) {
            settings = JSON.parse(JSON.stringify(settings));
        }
        emitter.autoRecycleOnComplete = autoRecycleOnComplete;
        emitter.__applySettings(settings);
        return emitter;
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

    public stopAllEffects() {
        const list = this._effects.toArray();
        for (let node of list) {
            (<BaseEffect>node).recycle();
        }
    }

    public parseSpriteSheet(spriteSheet: PIXI.Spritesheet, filter?: string): IParseSpriteSheetResult {
        return this.parseObject(spriteSheet.data.frames, filter);
    }

    public parseTextureCache(filter?: string): IParseSpriteSheetResult {
        return this.parseObject(PIXI.utils.TextureCache, filter);
    }

    public get active(): boolean {
        return this._active;
    }

    // *********************************************************************************************
    // * Internal													                                        							   *
    // *********************************************************************************************

    public __addActiveEffect(effect: BaseEffect) {
        this._effects.add(effect);
    }

    public __removeActiveEffect(effect: BaseEffect) {
        this._effects.remove(effect);
    }


    public __getSprite(componentId: string): Sprite {
        const cache = this._cache.sprites;
        let pool = cache[componentId];

        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }

        if (pool.length == 0) {
            const settings = <ISpriteSettings>this._settingsCache.sprites[componentId];
            if (settings == null) throw new Error(`Settings not defined for '${componentId}'`);
            const sprite = new Sprite(componentId, settings.texture, settings.anchorX, settings.anchorY);
            sprite.__fx = this;
            return sprite;
        }
        return pool.pop();
    }

    public __getMovieClip(componentId: string): MovieClip {
        const cache = this._cache.mcs;
        let pool = cache[componentId];

        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }

        if (pool.length == 0) {
            let settings = <IMovieClipSettings>this._settingsCache.mcs[componentId];
            if (settings == null) throw new Error(`Settings not defined for '${componentId}'`);
            const mc = new MovieClip(componentId, settings.textures, settings.anchorX, settings.anchorY);
            mc.__fx = this;
            return mc;
        }
        return pool.pop();
    }

    public __getParticle(): Particle {
        let cache = this._cache,
            pool = cache.particles;

        if (pool.length == 0) {
            const particle = new Particle();
            particle.__fx = this;
            return particle;
        }
        return pool.pop();
    }

    public __getEmitterCore(type: string, emitter: ParticleEmitter): BaseEmitterCore {
        let cache = this._cache.cores;
        let pool = cache[type];

        if (pool == null) {
            pool = cache[type] = [];
        }

        if (pool.length == 0) {
            return new FX.__emitterCores[type](type);

        }
        return pool.pop();
    }

    public __recycleParticle(particle: Particle) {
        this._cache.particles.push(particle);
    }

    public __recycleSprite(componentId: string, object: any) {
        this._cache.sprites[componentId].push(object);
    }

    public __recycleMovieClip(componentId: string, object: any) {
        this._cache.mcs[componentId].push(object);
    }

    public __recycleEmitter(emitter: ParticleEmitter) {
        this._effects.remove(emitter);
        this.__recycleEmitterCore(emitter.core);
        this._cache.emitters.push(emitter);
    }

    public __recycleEffectSequence(effectSequence: EffectSequence) {
        this._effects.remove(effectSequence);
        this._cache.effectSequences.push(effectSequence);
    }

    public __recycleEmitterCore(core: BaseEmitterCore) {
        this._cache.cores[core.type].push(core);
    }

    // *********************************************************************************************
    // * Private													                                        							   *
    // *********************************************************************************************
    private parseObject(object: any, filter?: string): IParseSpriteSheetResult {

        const frames = object;
        const mcs = {};
        const result: IParseSpriteSheetResult = {sprites: [], movieClips: []};
        for (let i in frames) {
            if (filter && i.indexOf(filter) == -1) {
                continue;
            }
            this.initSprite(i, {texture: i, anchorX: 0.5, anchorY: 0.5});
            result.sprites.push(i);
            if (i.substr(0, 3) == 'mc_') {
                const parts = i.split('_');
                const group = parts[1];
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
}


// *********************************************************************************************
// * Interfaces												                                        							   *
// *********************************************************************************************

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
    params: ICircleCoreParams |
        IRingCoreParams |
        IBoxCoreParams
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
    __removeChildEmitter(emitter: ParticleEmitter);
}

export interface IParticle extends IParticleEmitterParent {
    componentId: string;

    init(emitter: ParticleEmitter, def: IParticleSettings, scaleMod?: number): IParticle;

    update(dt: number);

    recycle();

    dispose();
}

export interface IParseSpriteSheetResult {
    sprites: string[];
    movieClips: string[];
}

export interface IAdditionalAsset {
    name: string;
    url: string;
}



