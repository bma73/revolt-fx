/// <reference types="pixi.js" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as PIXI from "pixi.js";
import { ParticleEmitter } from "./ParticleEmitter";
import { LinkedList } from "./util/LinkedList";
import { RingEmitterCore } from "./core/RingEmitterCore";
import { CircleEmitterCore } from "./core/CircleEmitterCore";
import { BoxEmitterCore } from "./core/BoxEmitterCore";
import { EffectSequence } from "./EffectSequence";
import { Sprite } from "./Sprite";
import { Particle } from "./Particle";
import { MovieClip } from "./MovieClip";
import { Sanitizer } from "./Sanitizer";
import { ComponentType } from "./ComponentType";
import { EffectSequenceComponentType } from "./EffectSequenceComponentType";
export class FX {
    constructor() {
        this.useBlendModes = true;
        this.particleCount = 0;
        this.emitterCount = 0;
        this.effectSequenceCount = 0;
        this.maxParticles = 5000;
        this.particleFac = 1;
        this._active = false;
        this._effects = new LinkedList();
        this.__containers = {};
        this.clearCache();
        this.start();
    }
    // *********************************************************************************************
    // * Public										                                        	   *
    // *********************************************************************************************
    start() {
        this._active = true;
        this._timeElapsed = Date.now();
    }
    pause() {
        this._active = false;
    }
    update(delta = 1) {
        if (!this.active)
            return;
        const t = Date.now();
        let dt = (t - this._timeElapsed) * 0.001;
        dt *= delta;
        const list = this._effects;
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
    setFloorY(value) {
        const s = this._settingsCache.emitters;
        for (let n in s) {
            s[n].floorY = value;
        }
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
    loadBundleFiles(bundleSettingsUrl, spritesheetUrl, spritesheetFilter = '', additionalAssets = []) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const data = {
                'rfx_spritesheet': spritesheetUrl,
                'rfx_bundleSettings': bundleSettingsUrl,
            };
            for (var i in additionalAssets) {
                data[i] = additionalAssets[i];
            }
            PIXI.Assets.addBundle('rfx_assets', data);
            const assets = yield PIXI.Assets.loadBundle('rfx_assets');
            resolve(this.initBundle(assets.rfx_bundleSettings));
        }));
    }
    initBundle(bundleSettings, clearCache) {
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
    addParticleEmitter(componentId, settings) {
        if (this._settingsCache.emitters[componentId])
            throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.emitters[componentId] = settings;
        this._nameMaps.emitters[settings.name] = settings;
        return this;
    }
    addEffectSequence(componentId, settings) {
        if (this._settingsCache.effectSequences[componentId])
            throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.effectSequences[componentId] = settings;
        this._nameMaps.effectSequences[settings.name] = settings;
        return this;
    }
    initSprite(componentId, settings) {
        if (this._settingsCache.sprites[componentId])
            throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.sprites[componentId] = settings;
        return this;
    }
    initMovieClip(componentId, settings) {
        if (this._settingsCache.mcs[componentId])
            throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.mcs[componentId] = settings;
        return this;
    }
    getMovieClips() {
        return this._settingsCache.mcs;
    }
    getSprites() {
        return this._settingsCache.sprites;
    }
    addContainer(key, container) {
        this.__containers[key] = container;
    }
    getEffectSequence(name) {
        const settings = this._nameMaps.effectSequences[name];
        if (!settings)
            throw new Error(`Settings not defined for '${name}'`);
        return this.getEffectSequenceById(settings.id);
    }
    getEffectSequenceById(componentId) {
        const pool = this._cache.effectSequences;
        let effectSequence;
        let settings = this._settingsCache.effectSequences[componentId];
        if (!settings)
            throw new Error(`Settings not defined for '${componentId}'`);
        if (pool.length == 0) {
            effectSequence = new EffectSequence(componentId);
            effectSequence.__fx = this;
        }
        else {
            effectSequence = pool.pop();
        }
        effectSequence.__applySettings(settings);
        return effectSequence;
    }
    getParticleEmitter(name, autoRecycleOnComplete = true, cloneSettings = false) {
        const settings = this._nameMaps.emitters[name];
        if (!settings)
            throw new Error(`Settings not defined for '${name}'`);
        return this.getParticleEmitterById(settings.id, autoRecycleOnComplete, cloneSettings);
    }
    getParticleEmitterById(componentId, autoRecycleOnComplete = true, cloneSettings = false) {
        const pool = this._cache.emitters;
        let emitter;
        let settings = this._settingsCache.emitters[componentId];
        if (!settings)
            throw new Error(`Settings not defined for '${componentId}'`);
        if (pool.length == 0) {
            emitter = new ParticleEmitter(componentId);
            emitter.__fx = this;
        }
        else {
            emitter = pool.pop();
        }
        if (cloneSettings) {
            settings = JSON.parse(JSON.stringify(settings));
        }
        emitter.autoRecycleOnComplete = autoRecycleOnComplete;
        emitter.__applySettings(settings);
        return emitter;
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
    stopAllEffects() {
        const list = this._effects.toArray();
        for (let node of list) {
            node.recycle();
        }
    }
    parseSpriteSheet(spriteSheet, filter) {
        return this.parseObject(spriteSheet.data.frames, filter);
    }
    parseTextureCache(filter) {
        const p = PIXI;
        // @ts-ignore
        if (p['utils'] !== undefined) {
            // Pixi 7.3.x
            return this.parseObject(p['utils'].TextureCache, filter);
        }
        return this.parseObject(p['Cache']['_cache'], filter);
    }
    get active() {
        return this._active;
    }
    // *********************************************************************************************
    // * Internal													                                        							   *
    // *********************************************************************************************
    __addActiveEffect(effect) {
        this._effects.add(effect);
    }
    __removeActiveEffect(effect) {
        this._effects.remove(effect);
    }
    __getSprite(componentId) {
        const cache = this._cache.sprites;
        let pool = cache[componentId];
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        if (pool.length == 0) {
            const settings = this._settingsCache.sprites[componentId];
            if (settings == null)
                throw new Error(`Settings not defined for '${componentId}'`);
            const sprite = new Sprite(componentId, settings.texture, settings.anchorX, settings.anchorY);
            sprite.__fx = this;
            return sprite;
        }
        return pool.pop();
    }
    __getMovieClip(componentId) {
        const cache = this._cache.mcs;
        let pool = cache[componentId];
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        if (pool.length == 0) {
            let settings = this._settingsCache.mcs[componentId];
            if (settings == null)
                throw new Error(`Settings not defined for '${componentId}'`);
            const mc = new MovieClip(componentId, settings.textures, settings.anchorX, settings.anchorY);
            mc.__fx = this;
            return mc;
        }
        return pool.pop();
    }
    __getParticle() {
        let cache = this._cache, pool = cache.particles;
        if (pool.length == 0) {
            const particle = new Particle();
            particle.__fx = this;
            return particle;
        }
        return pool.pop();
    }
    __getEmitterCore(type, emitter) {
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
    __recycleParticle(particle) {
        this._cache.particles.push(particle);
    }
    __recycleSprite(componentId, object) {
        this._cache.sprites[componentId].push(object);
    }
    __recycleMovieClip(componentId, object) {
        this._cache.mcs[componentId].push(object);
    }
    __recycleEmitter(emitter) {
        this._effects.remove(emitter);
        this.__recycleEmitterCore(emitter.core);
        this._cache.emitters.push(emitter);
    }
    __recycleEffectSequence(effectSequence) {
        this._effects.remove(effectSequence);
        this._cache.effectSequences.push(effectSequence);
    }
    __recycleEmitterCore(core) {
        this._cache.cores[core.type].push(core);
    }
    // *********************************************************************************************
    // * Private													                               *
    // *********************************************************************************************
    parseObject(object, filter) {
        let frames;
        if (object instanceof Map) {
            frames = new Map();
            const mapObject = object;
            const values = mapObject.values();
            for (const [key, value] of mapObject) {
                if (value instanceof PIXI.Texture) {
                    frames[key] = value;
                }
            }
        }
        else {
            frames = object;
        }
        const mcs = {};
        const result = { sprites: [], movieClips: [] };
        for (let i in frames) {
            if (filter && i.indexOf(filter) == -1) {
                continue;
            }
            this.initSprite(i, { texture: i, anchorX: 0.5, anchorY: 0.5 });
            result.sprites.push(i);
            if (i.substr(0, 3) == 'mc_') {
                const parts = i.split('_');
                const group = parts[1];
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
}
FX.settingsVersion = 0;
FX.version = '1.1.0';
FX._bundleHash = '80c6df7fb0d3d898f34ce0031c037fef';
FX.ComponentType = ComponentType;
FX.EffectSequenceComponentType = EffectSequenceComponentType;
FX.__emitterCores = {
    circle: CircleEmitterCore,
    box: BoxEmitterCore,
    ring: RingEmitterCore
};
//# sourceMappingURL=FX.js.map