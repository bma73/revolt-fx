"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = require("./util/LinkedList");
var ParticleEmitter_1 = require("./ParticleEmitter");
var MovieClip_1 = require("./MovieClip");
var Sprite_1 = require("./Sprite");
var Particle_1 = require("./Particle");
var EffectSequence_1 = require("./EffectSequence");
var ComponentType;
(function (ComponentType) {
    ComponentType[ComponentType["Sprite"] = 0] = "Sprite";
    ComponentType[ComponentType["MovieClip"] = 1] = "MovieClip";
    ComponentType[ComponentType["Emitter"] = 2] = "Emitter";
})(ComponentType = exports.ComponentType || (exports.ComponentType = {}));
var RevoltEffects = /** @class */ (function () {
    function RevoltEffects() {
        this.particleCount = 0;
        this._active = false;
        this._cache = {};
        this._settingsCache = {};
        this._effects = new LinkedList_1.LinkedList();
        this.start();
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    RevoltEffects.prototype.start = function () {
        this._active = true;
        this._timeElapsed = Date.now();
    };
    RevoltEffects.prototype.stop = function () {
        this._active = false;
    };
    RevoltEffects.prototype.update = function () {
        if (!this.active)
            return;
        var t = Date.now();
        var dt = (t - this._timeElapsed) * 0.001;
        var list = this._effects;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            node.update(dt);
            node = next;
        }
        this._timeElapsed = t;
    };
    RevoltEffects.prototype.clearCache = function () {
        this._cache = {};
        this._settingsCache = {};
    };
    RevoltEffects.prototype.dispose = function () {
        var list = this._effects;
        var node = list.first;
        while (node) {
            node.dispose();
            node = node.next;
        }
        list.clear();
        this.clearCache();
    };
    RevoltEffects.prototype.initParticleEmitter = function (componentId, settings) {
        if (this._settingsCache[componentId])
            throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateEmitterSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    };
    RevoltEffects.prototype.initEffectSequence = function (componentId, settings) {
        if (this._settingsCache[componentId])
            throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateEffectSequenceSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    };
    RevoltEffects.prototype.initSprite = function (componentId, settings) {
        if (this._settingsCache[componentId])
            throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateSpriteSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    };
    RevoltEffects.prototype.initMovieClip = function (componentId, settings) {
        if (this._settingsCache[componentId])
            throw new Error('ComponentId "' + componentId + '" already exists.');
        this.__validateMovieClipSettings(settings);
        this._settingsCache[componentId] = settings;
        return this;
    };
    RevoltEffects.prototype.getEffectSequence = function (componentId) {
        var cache = this._cache, pool = cache[componentId], effectSequence;
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        var settings = this._settingsCache[componentId];
        if (settings == null)
            throw new Error('Settings not defined');
        if (pool.length == 0) {
            effectSequence = new EffectSequence_1.EffectSequence(componentId);
        }
        else {
            effectSequence = pool.pop();
        }
        effectSequence.__applySettings(settings);
        return effectSequence;
    };
    RevoltEffects.prototype.getParticleEmitter = function (componentId) {
        var cache = this._cache, pool = cache[componentId], emitter;
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        var settings = this._settingsCache[componentId];
        if (settings == null)
            throw new Error('Settings not defined');
        if (pool.length == 0) {
            emitter = new ParticleEmitter_1.ParticleEmitter(componentId);
        }
        else {
            emitter = pool.pop();
        }
        emitter.__applySettings(settings);
        return emitter;
    };
    RevoltEffects.prototype.getSprite = function (componentId) {
        var cache = this._cache, pool = cache[componentId];
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        if (pool.length == 0) {
            var settings = this._settingsCache[componentId];
            if (settings == null)
                throw new Error('Settings not defined');
            return new Sprite_1.Sprite(componentId, settings.texture, settings.anchorX, settings.anchorY);
        }
        // console.log('sprite from pool');
        return pool.pop();
    };
    RevoltEffects.prototype.getMovieClip = function (componentId) {
        var cache = this._cache, pool = cache[componentId];
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        if (pool.length == 0) {
            var settings = this._settingsCache[componentId];
            if (settings == null)
                throw new Error('Settings not defined');
            return new MovieClip_1.MovieClip(componentId, settings.textures, settings.anchorX, settings.anchorY);
        }
        return pool.pop();
    };
    RevoltEffects.prototype.stopEmitter = function (emitter, dispose) {
        if (dispose === void 0) { dispose = false; }
        if (emitter.list === this._effects) {
            this._effects.remove(emitter);
        }
        if (dispose) {
            emitter.dispose();
        }
        else {
            this.__recycleEmitter(emitter);
        }
    };
    RevoltEffects.prototype.parseSpriteSheet = function (spriteSheet) {
        var frames = spriteSheet.frames;
        var mcs = {};
        var result = { sprites: [], movieClips: [] };
        for (var i in frames) {
            this.initSprite(i, { texture: i, anchorX: 0.5, anchorY: 0.5 });
            result.sprites.push(i);
            if (i.indexOf('mc') != -1) {
                var parts = i.split('_');
                var group = parts[1];
                if (mcs[group] == null)
                    mcs[group] = [];
                mcs[group].push(i);
            }
        }
        for (var i in mcs) {
            var textures = mcs[i];
            result.movieClips.push(i);
            this.initMovieClip(i, { textures: textures, anchorX: 0.5, anchorY: 0.5 });
        }
        return result;
    };
    Object.defineProperty(RevoltEffects.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    // *********************************************************************************************
    // * Internal																				   *
    // *********************************************************************************************
    RevoltEffects.prototype.__addActiveEffect = function (effect) {
        this._effects.add(effect);
    };
    RevoltEffects.prototype.__getParticle = function () {
        var cache = this._cache, id = '__particles__', pool = cache[id];
        if (cache[id] == null) {
            pool = cache[id] = [];
        }
        if (pool.length == 0) {
            return new Particle_1.Particle();
        }
        return pool.pop();
    };
    RevoltEffects.prototype.__recycleParticle = function (particle) {
        // switch (particle.settings.componentType) {
        //     default:
        //         this._cache[particle.componentId].push(particle.component);
        //         particle.component.recycle();
        //         break;
        // }
        // particle.recycle();
        this._cache['__particles__'].push(particle);
        // console.log('cache particles:', this._cache['__particles__'].length, 'sprites:', this._cache['tile'].length);
    };
    RevoltEffects.prototype.__recycleObject = function (componentId, object) {
        this._cache[componentId].push(object);
        // if (object.recycle) object.recycle();
    };
    RevoltEffects.prototype.__recycleEffect = function (effect) {
        if (effect.list === this._effects) {
            this._effects.remove(effect);
        }
        this._cache[effect.componentId].push(effect);
        // effect.recycle();
    };
    RevoltEffects.prototype.__recycleEmitter = function (emitter) {
        if (emitter.list === this._effects) {
            this._effects.remove(emitter);
        }
        this._cache[emitter.componentId].push(emitter);
        // emitter.recycle();
    };
    RevoltEffects.prototype.__recycleEffectSequence = function (effectSequence) {
        if (effectSequence.list === this._effects) {
            this._effects.remove(effectSequence);
        }
        this._cache[effectSequence.componentId].push(effectSequence);
        // effectSequence.recycle();
    };
    // *********************************************************************************************
    // * Private																				   *
    // *********************************************************************************************
    RevoltEffects.prototype.__validateEmitterSettings = function (settings) {
        settings.spawnFrequency = settings.spawnFrequency || 0.05;
        settings.maxParticles = settings.maxParticles || Number.MAX_VALUE;
        settings.duration = settings.duration || 0;
        settings.spawnCount = settings.spawnCount || 1;
    };
    RevoltEffects.prototype.__validateSpriteSettings = function (settings) {
        if (settings.texture == null)
            throw new Error("Texture name is missing.");
        settings.anchorX = settings.anchorX || 0.5;
        settings.anchorY = settings.anchorY || 0.5;
    };
    RevoltEffects.prototype.__validateMovieClipSettings = function (settings) {
        if (settings.textures == null)
            throw new Error("Texture names are missing.");
        settings.anchorX = settings.anchorX || 0.5;
        settings.anchorY = settings.anchorY || 0.5;
    };
    RevoltEffects.prototype.__validateEffectSequenceSettings = function (settings) {
        if (settings.effects == null)
            throw new Error("Effect array is missing.");
        for (var _i = 0, _a = settings.effects; _i < _a.length; _i++) {
            var e = _a[_i];
            e.blendMode = e.blendMode || 0;
            e.duration = e.duration || 0.1;
            e.delay = e.delay || 0;
            e.tint = e.tint || 0xffffff;
            e.scaleMax = e.scaleMax || 1;
            e.scaleMin = e.scaleMin || 1;
            e.alphaMax = e.alphaMax || 1;
            e.alphaMin = e.alphaMin || 1;
        }
    };
    RevoltEffects.instance = new RevoltEffects();
    return RevoltEffects;
}());
exports.RevoltEffects = RevoltEffects;
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
