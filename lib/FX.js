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
import { ComponentType } from "./ComponentType";
import { EffectSequence } from "./EffectSequence";
import { EffectSequenceComponentType } from "./EffectSequenceComponentType";
import { MovieClip } from "./MovieClip";
import { Particle } from "./Particle";
import { ParticleEmitter } from "./ParticleEmitter";
import { Sanitizer } from "./Sanitizer";
import { Sprite } from "./Sprite";
import { BoxEmitterCore } from "./core/BoxEmitterCore";
import { CircleEmitterCore } from "./core/CircleEmitterCore";
import { RingEmitterCore } from "./core/RingEmitterCore";
import { LinkedList } from "./util/LinkedList";
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
    /**
     * Starts the process.
     *
     * @param {} - No parameters.
     * @return {} - No return value.
     */
    start() {
        this._active = true;
        this._timeElapsed = Date.now();
    }
    /**
     * Pauses the execution of the function.
     *
     * @param {}
     * @return {}
     */
    pause() {
        this._active = false;
    }
    /**
     * Updates the state of the object based on the elapsed time.
     *
     * @param {number} delta - The time delta to update by. Default is 1.
     */
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
    /**
     * Clears the cache by resetting all cache objects to empty values.
     *
     * @param {}
     * @return {}
     */
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
    /**
     * Sets the value of the floorY property for all emitters in the settings cache.
     *
     * @param {number} value - The new value for the floorY property.
     */
    setFloorY(value) {
        const s = this._settingsCache.emitters;
        for (let n in s) {
            s[n].floorY = value;
        }
    }
    /**
     * Disposes of all the effects in the list and clears the cache.
     */
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
    /**
     * Loads the bundle files and returns a promise that resolves to the parsed sprite sheet result.
     *
     * @param {string} bundleSettingsUrl - The URL of the bundle settings.
     * @param {string} spritesheetUrl - The URL of the sprite sheet.
     * @param {string} spritesheetFilter - The filter for the sprite sheet. Default is an empty string.
     * @param {string[]} additionalAssets - An array of additional asset URLs. Default is an empty array.
     * @return {Promise<IParseSpriteSheetResult>} A promise that resolves to the parsed sprite sheet result.
     */
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
    /**
     * Initializes the bundle with the given settings and optionally clears the cache.
     *
     * @param {any} bundleSettings - The settings for the bundle.
     * @param {boolean} clearCache - Whether to clear the cache or not. Optional, default is false.
     * @returns {IParseSpriteSheetResult} The result of parsing the sprite sheet.
     */
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
    /**
     * Adds a particle emitter to the FX object.
     *
     * @param {string} componentId - The unique identifier for the emitter component.
     * @param {IEmitterSettings} settings - The settings for the emitter.
     * @throws {Error} Throws an error if the componentId already exists.
     * @return {FX} Returns the FX object for chaining.
     */
    addParticleEmitter(componentId, settings) {
        if (this._settingsCache.emitters[componentId])
            throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.emitters[componentId] = settings;
        this._nameMaps.emitters[settings.name] = settings;
        return this;
    }
    /**
     * Adds an effect sequence to the component with the specified ID.
     *
     * @param {string} componentId - The ID of the component.
     * @param {IEffectSequenceSettings} settings - The settings for the effect sequence.
     * @throws {Error} If a component with the same ID already exists.
     * @return {FX} The current instance of the FX class.
     */
    addEffectSequence(componentId, settings) {
        if (this._settingsCache.effectSequences[componentId])
            throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.effectSequences[componentId] = settings;
        this._nameMaps.effectSequences[settings.name] = settings;
        return this;
    }
    /**
     * Initializes a sprite with the specified component ID and settings.
     *
     * @param {string} componentId - The ID of the component.
     * @param {ISpriteSettings} settings - The settings for the sprite.
     * @throws {Error} Throws an error if the component ID already exists.
     * @returns {FX} Returns the current instance of the FX class.
     */
    initSprite(componentId, settings) {
        if (this._settingsCache.sprites[componentId])
            throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.sprites[componentId] = settings;
        return this;
    }
    /**
     * Initializes a movie clip with the specified component ID and settings.
     *
     * @param {string} componentId - The unique identifier for the movie clip component.
     * @param {IMovieClipSettings} settings - The settings for the movie clip.
     * @return {FX} The instance of the FX class.
     */
    initMovieClip(componentId, settings) {
        if (this._settingsCache.mcs[componentId])
            throw new Error(`ComponentId '${componentId}' already exists.`);
        this._settingsCache.mcs[componentId] = settings;
        return this;
    }
    /**
     * Retrieves the movie clips from the settings cache.
     *
     * @return {Object} An object containing movie clip settings.
     */
    getMovieClips() {
        return this._settingsCache.mcs;
    }
    /**
     * Retrieves the sprites from the settings cache.
     *
     * @return {Object} An object containing sprite settings.
     */
    getSprites() {
        return this._settingsCache.sprites;
    }
    /**
     * Adds a container to the __containers object with the specified key.
     *
     * @param {string} key - The key used to identify the container in the __containers object.
     * @param {PIXI.Container} container - The container to be added.
     */
    addContainer(key, container) {
        this.__containers[key] = container;
    }
    /**
     * Retrieves the EffectSequence object with the specified name.
     *
     * @param {string} name - The name of the EffectSequence to retrieve.
     * @return {EffectSequence} - The EffectSequence object with the specified name.
     */
    getEffectSequence(name) {
        const settings = this._nameMaps.effectSequences[name];
        if (!settings)
            throw new Error(`Settings not defined for '${name}'`);
        return this.getEffectSequenceById(settings.id);
    }
    /**
     * Retrieves an EffectSequence object by its component ID.
     *
     * @param {string} componentId - The ID of the component.
     * @return {EffectSequence} The retrieved EffectSequence object.
     */
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
    /**
     * Retrieves a particle emitter by its name.
     *
     * @param {string} name - The name of the particle emitter.
     * @param {boolean} autoRecycleOnComplete - (Optional) Specifies whether the emitter should auto recycle when complete. Default is true.
     * @param {boolean} cloneSettings - (Optional) Specifies whether the emitter settings should be cloned. Default is false.
     * @return {ParticleEmitter} The particle emitter with the specified name.
     */
    getParticleEmitter(name, autoRecycleOnComplete = true, cloneSettings = false) {
        const settings = this._nameMaps.emitters[name];
        if (!settings)
            throw new Error(`Settings not defined for '${name}'`);
        return this.getParticleEmitterById(settings.id, autoRecycleOnComplete, cloneSettings);
    }
    /**
     * Retrieves a particle emitter by its component ID.
     *
     * @param {string} componentId - The ID of the component.
     * @param {boolean} autoRecycleOnComplete - Whether the emitter should automatically recycle itself when it completes.
     * @param {boolean} cloneSettings - Whether to clone the settings object before applying them to the emitter.
     * @return {ParticleEmitter} The retrieved particle emitter.
     */
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
    /**
     * Stops the specified particle emitter.
     *
     * @param {ParticleEmitter} emitter - The particle emitter to stop.
     * @param {boolean} [dispose=false] - Whether to dispose the emitter or recycle it.
     */
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
    /**
     * Stops all effects.
     *
     * @param {none} none - This function does not take any parameters.
     * @return {void} This function does not return a value.
     */
    stopAllEffects() {
        const list = this._effects.toArray();
        for (let node of list) {
            node.recycle();
        }
    }
    /**
     * Parses a sprite sheet.
     *
     * @param {PIXI.Spritesheet} spriteSheet - The sprite sheet to parse.
     * @param {string} filter - Optional filter to apply to the sprite sheet.
     * @return {IParseSpriteSheetResult} The result of parsing the sprite sheet.
     */
    parseSpriteSheet(spriteSheet, filter) {
        return this.parseObject(spriteSheet.data.frames, filter);
    }
    /**
     * Parses the texture cache and returns the result as an IParseSpriteSheetResult object.
     *
     * @param {string} [filter] - An optional parameter to filter the results.
     * @returns {IParseSpriteSheetResult} - The parsed sprite sheet result.
     */
    parseTextureCache(filter) {
        return this.parseObject(PIXI['Cache']['_cache'], filter);
    }
    /**
     * Returns if the FX instance is active.
     *
     * @return {boolean} The value of the 'active' property.
     */
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
FX.version = '1.3.2';
FX._bundleHash = '80c6df7fb0d3d898f34ce0031c037fef';
FX.ComponentType = ComponentType;
FX.EffectSequenceComponentType = EffectSequenceComponentType;
FX.__emitterCores = {
    circle: CircleEmitterCore,
    box: BoxEmitterCore,
    ring: RingEmitterCore
};
//# sourceMappingURL=FX.js.map