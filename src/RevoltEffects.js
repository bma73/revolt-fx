
import { LinkedList } from "./util/LinkedList";
import { ParticleEmitter } from "./ParticleEmitter";
import { MovieClip } from "./MovieClip";
import { Sprite } from "./Sprite";
import { Particle } from "./Particle";
import { EffectSequence } from "./EffectSequence";

export var ComponentType;
(function (ComponentType) {
    ComponentType[ComponentType["Sprite"] = 0] = "Sprite";
    ComponentType[ComponentType["MovieClip"] = 1] = "MovieClip";
    ComponentType[ComponentType["Emitter"] = 2] = "Emitter";
})(ComponentType || (ComponentType = {}));


export class RevoltEffects {
    constructor() {
        this.particleCount = 0;
        this._active = false;
        this._cache = {};
        this._settingsCache = {};
        this._effects = new LinkedList();
        this.start();
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    start() {
        this._active = true;
        this._timeElapsed = Date.now();
    }
    stop() {
        this._active = false;
    }
    update() {
        if (!this.active)
            return;
        let t = Date.now();
        let dt = (t - this._timeElapsed) * 0.001;
        let list = this._effects;
        let node = list.first;
        let next;
        while (node) {
            next = node.next;
            node.update(dt);
            node = next;
        }
        this._timeElapsed = t;
    }
    clearCache() {
        this._cache = {};
        this._settingsCache = {};
    }
    dispose() {
        let list = this._effects;
        let node = list.first;
        while (node) {
            node.dispose();
            node = node.next;
        }
        list.clear();
        this.clearCache();
    }
    initParticleEmitter(componentId, settings) {
        if (this._settingsCache[componentId])
            throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateEmitterSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    }
    initEffectSequence(componentId, settings) {
        if (this._settingsCache[componentId])
            throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateEffectSequenceSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    }
    initSprite(componentId, settings) {
        if (this._settingsCache[componentId])
            throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateSpriteSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    }
    initMovieClip(componentId, settings) {
        if (this._settingsCache[componentId])
            throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateMovieClipSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    }
    getEffectSequence(componentId) {
        let cache = this._cache, pool = cache[componentId], effectSequence;
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        let settings = this._settingsCache[componentId];
        if (settings == null)
            throw new Error('Settings not defined');
        if (pool.length == 0) {
            effectSequence = new EffectSequence(componentId);
        }
        else {
            effectSequence = pool.pop();
        }
        effectSequence.__applySettings(settings);
        return effectSequence;
    }
    getParticleEmitter(componentId) {
        let cache = this._cache, pool = cache[componentId], emitter;
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        let settings = this._settingsCache[componentId];
        if (settings == null)
            throw new Error('Settings not defined');
        if (pool.length == 0) {
            emitter = new ParticleEmitter(componentId);
        }
        else {
            emitter = pool.pop();
        }
        emitter.__applySettings(settings);
        return emitter;
    }
    getSprite(componentId) {
        let cache = this._cache, pool = cache[componentId];
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        if (pool.length == 0) {
            let settings = this._settingsCache[componentId];
            if (settings == null)
                throw new Error('Settings not defined');
            return new Sprite(componentId, settings.texture, settings.anchorX, settings.anchorY);
        }
        // console.log('sprite from pool');
        return pool.pop();
    }
    getMovieClip(componentId) {
        let cache = this._cache, pool = cache[componentId];
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        if (pool.length == 0) {
            let settings = this._settingsCache[componentId];
            if (settings == null)
                throw new Error('Settings not defined');
            return new MovieClip(componentId, settings.textures, settings.anchorX, settings.anchorY);
        }
        return pool.pop();
    }
    stopEmitter(emitter, dispose = false) {
        if (emitter.list === this._effects) {
            this._effects.remove(emitter);
        }
        if (dispose) {
            emitter.dispose();
        }
        else {
            this.__recycleEmitter(emitter);
        }
    }
    parseSpriteSheet(spriteSheet) {
        let frames = spriteSheet.frames;
        let mcs = {};
        let result = { sprites: [], movieClips: [] };
        for (let i in frames) {
            this.initSprite(i, { texture: i, anchorX: 0.5, anchorY: 0.5 });
            result.sprites.push(i);
            if (i.indexOf('mc') != -1) {
                let parts = i.split('_');
                let group = parts[1];
                if (mcs[group] == null)
                    mcs[group] = [];
                mcs[group].push(i);
            }
        }
        for (let i in mcs) {
            let textures = mcs[i];
            result.movieClips.push(i);
            this.initMovieClip(i, { textures: textures, anchorX: 0.5, anchorY: 0.5 });
        }
        return result;
    }
    get active() {
        return this._active;
    }
    // *********************************************************************************************
    // * Internal																				   *
    // *********************************************************************************************
    __addActiveEffect(effect) {
        this._effects.add(effect);
    }
    __getParticle() {
        let cache = this._cache, id = '__particles__', pool = cache[id];
        if (cache[id] == null) {
            pool = cache[id] = [];
        }
        if (pool.length == 0) {
            return new Particle();
        }
        return pool.pop();
    }
    __recycleParticle(particle) {
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
    __recycleObject(componentId, object) {
        this._cache[componentId].push(object);
        // if (object.recycle) object.recycle();
    }
    __recycleEffect(effect) {
        if (effect.list === this._effects) {
            this._effects.remove(effect);
        }
        this._cache[effect.componentId].push(effect);
        // effect.recycle();
    }
    __recycleEmitter(emitter) {
        if (emitter.list === this._effects) {
            this._effects.remove(emitter);
        }
        this._cache[emitter.componentId].push(emitter);
        // emitter.recycle();
    }
    __recycleEffectSequence(effectSequence) {
        if (effectSequence.list === this._effects) {
            this._effects.remove(effectSequence);
        }
        this._cache[effectSequence.componentId].push(effectSequence);
        // effectSequence.recycle();
    }
    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************
    __validateEmitterSettings(settings) {
        settings.spawnFrequency = settings.spawnFrequency || 0.05;
        settings.maxParticles = settings.maxParticles || Number.MAX_VALUE;
        settings.duration = settings.duration || 0;
        settings.spawnCount = settings.spawnCount || 1;
    }
    __validateSpriteSettings(settings) {
        if (settings.texture == null)
            throw new Error("Texture name is missing.");
        settings.anchorX = settings.anchorX || 0.5;
        settings.anchorY = settings.anchorY || 0.5;
    }
    __validateMovieClipSettings(settings) {
        if (settings.textures == null)
            throw new Error("Texture names are missing.");
        settings.anchorX = settings.anchorX || 0.5;
        settings.anchorY = settings.anchorY || 0.5;
    }
    __validateEffectSequenceSettings(settings) {
        if (settings.effects == null)
            throw new Error("Effect array is missing.");
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
RevoltEffects.instance = new RevoltEffects();
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