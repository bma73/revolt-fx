"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ParticleEmitter_1 = require("./ParticleEmitter");
var LinkedList_1 = require("./util/LinkedList");
var RingEmitterCore_1 = require("./core/RingEmitterCore");
var CircleEmitterCore_1 = require("./core/CircleEmitterCore");
var BoxEmitterCore_1 = require("./core/BoxEmitterCore");
var EffectSequence_1 = require("./EffectSequence");
var Sprite_1 = require("./Sprite");
var Particle_1 = require("./Particle");
var MovieClip_1 = require("./MovieClip");
var Sanitizer_1 = require("./Sanitizer");
var ComponentType;
(function (ComponentType) {
    ComponentType[ComponentType["Sprite"] = 0] = "Sprite";
    ComponentType[ComponentType["MovieClip"] = 1] = "MovieClip";
})(ComponentType || (ComponentType = {}));
var EffectSequenceComponentType;
(function (EffectSequenceComponentType) {
    EffectSequenceComponentType[EffectSequenceComponentType["Sprite"] = 0] = "Sprite";
    EffectSequenceComponentType[EffectSequenceComponentType["MovieClip"] = 1] = "MovieClip";
    EffectSequenceComponentType[EffectSequenceComponentType["Emitter"] = 2] = "Emitter";
    EffectSequenceComponentType[EffectSequenceComponentType["Trigger"] = 3] = "Trigger";
})(EffectSequenceComponentType || (EffectSequenceComponentType = {}));
var FX = (function () {
    function FX() {
        this.useBlendModes = true;
        this.particleCount = 0;
        this.emitterCount = 0;
        this.effectSequenceCount = 0;
        this.maxParticles = 5000;
        this.particleFac = 1;
        this._active = false;
        this._effects = new LinkedList_1.LinkedList();
        this.__containers = {};
        this.clearCache();
        this.start();
    }
    FX.prototype.start = function () {
        this._active = true;
        this._timeElapsed = Date.now();
    };
    FX.prototype.pause = function () {
        this._active = false;
    };
    FX.prototype.update = function () {
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
    FX.prototype.clearCache = function () {
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
    };
    FX.prototype.setFloorY = function (value) {
        var s = this._settingsCache.emitters;
        for (var n in s) {
            s[n].floorY = value;
        }
    };
    FX.prototype.dispose = function () {
        var list = this._effects;
        var node = list.first;
        while (node) {
            node.dispose();
            node = node.next;
        }
        list.clear();
        this.clearCache();
    };
    FX.prototype.loadBundleFiles = function (bundleSettingsUrl, spritesheetUrl, spritesheetFilter, additionalAssets) {
        var _this = this;
        if (spritesheetFilter === void 0) { spritesheetFilter = ''; }
        return new Promise(function (resolve, reject) {
            var loader = new PIXI.loaders.Loader();
            loader.onError.add(function (err) {
                reject(err);
            });
            loader
                .add('rfx_spritesheet', spritesheetUrl)
                .add('rfx_bundleSettings', bundleSettingsUrl);
            if (additionalAssets) {
                for (var _i = 0, additionalAssets_1 = additionalAssets; _i < additionalAssets_1.length; _i++) {
                    var arg = additionalAssets_1[_i];
                    if (arg.hasOwnProperty('name') && arg.hasOwnProperty('url')) {
                        loader.add(arg.name, arg.url);
                    }
                    else {
                        loader.add(arg);
                    }
                }
            }
            loader.load(function (l, d) {
                resolve(_this.initBundle(d.rfx_bundleSettings.data));
            });
        });
    };
    FX.prototype.loadBundleZip = function (zipUrl, jszipInstance, additionalAssets) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (jszipInstance == null) {
                reject('JSZip instance not provided.');
                return;
            }
            var loader = new PIXI.loaders.Loader();
            loader.add('zip', zipUrl, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BLOB });
            if (additionalAssets) {
                for (var _i = 0, additionalAssets_2 = additionalAssets; _i < additionalAssets_2.length; _i++) {
                    var arg = additionalAssets_2[_i];
                    if (arg.hasOwnProperty('name') && arg.hasOwnProperty('url')) {
                        loader.add(arg.name, arg.url);
                    }
                    else {
                        loader.add(arg);
                    }
                }
            }
            loader.load(function (l, d) { return __awaiter(_this, void 0, void 0, function () {
                var spritesheetImageData, spritesheetDef, settingsDef_1, list_1, _a, _b, _i, n, entry, base64, s, def, texture, spritesheet, err_1;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 8, , 9]);
                            spritesheetImageData = void 0;
                            spritesheetDef = void 0;
                            return [4, jszipInstance.loadAsync(d.zip.data)];
                        case 1:
                            _c.sent();
                            list_1 = [];
                            jszipInstance.forEach(function (path, entry) {
                                list_1.push(entry);
                            });
                            _a = [];
                            for (_b in list_1)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3, 7];
                            n = _a[_i];
                            entry = list_1[n];
                            if (!(entry.name.indexOf('.png') != -1)) return [3, 4];
                            return [4, entry.async('base64')];
                        case 3:
                            base64 = _c.sent();
                            spritesheetImageData = "data:image/png;base64," + base64;
                            return [3, 6];
                        case 4:
                            if (!(entry.name.indexOf('.json') != -1)) return [3, 6];
                            return [4, entry.async('string')];
                        case 5:
                            s = _c.sent();
                            def = JSON.parse(s);
                            if (def.__h) {
                                if (def.__h !== FX._bundleHash) {
                                    reject('Invalid settings file.');
                                    return [2];
                                }
                                settingsDef_1 = def;
                            }
                            else if (def.frames) {
                                spritesheetDef = def;
                            }
                            _c.label = 6;
                        case 6:
                            _i++;
                            return [3, 2];
                        case 7:
                            texture = PIXI.Texture.from(spritesheetImageData);
                            spritesheet = new PIXI.Spritesheet(texture.baseTexture, spritesheetDef);
                            spritesheet.parse(function () {
                                setTimeout(function () {
                                    resolve(_this.initBundle(settingsDef_1, true));
                                }, 100);
                            });
                            return [3, 9];
                        case 8:
                            err_1 = _c.sent();
                            reject(err_1.toString());
                            return [3, 9];
                        case 9: return [2];
                    }
                });
            }); });
        });
    };
    FX.prototype.initBundle = function (bundleSettings, clearCache) {
        if (bundleSettings.__h !== FX._bundleHash) {
            throw new Error('Invalid settings file.');
        }
        if (bundleSettings.__v != FX.settingsVersion) {
            throw new Error('Settings version mismatch.');
        }
        Sanitizer_1.Sanitizer.sanitizeBundle(bundleSettings);
        if (clearCache) {
            this.clearCache();
        }
        for (var n in bundleSettings.emitters) {
            var preset = bundleSettings.emitters[n];
            this.addParticleEmitter(preset.id, preset);
        }
        for (var n in bundleSettings.sequences) {
            var preset = bundleSettings.sequences[n];
            this.addEffectSequence(preset.id, preset);
        }
        this.useBlendModes = bundleSettings.useBlendModes;
        this.maxParticles = bundleSettings.maxParticles;
        return this.parseTextureCache(bundleSettings.spritesheetFilter);
    };
    FX.prototype.addParticleEmitter = function (componentId, settings) {
        if (this._settingsCache.emitters[componentId])
            throw new Error("ComponentId '" + componentId + "' already exists.");
        this._settingsCache.emitters[componentId] = settings;
        this._nameMaps.emitters[settings.name] = settings;
        return this;
    };
    FX.prototype.addEffectSequence = function (componentId, settings) {
        if (this._settingsCache.effectSequences[componentId])
            throw new Error("ComponentId '" + componentId + "' already exists.");
        this._settingsCache.effectSequences[componentId] = settings;
        this._nameMaps.effectSequences[settings.name] = settings;
        return this;
    };
    FX.prototype.initSprite = function (componentId, settings) {
        if (this._settingsCache.sprites[componentId])
            throw new Error("ComponentId '" + componentId + "' already exists.");
        this._settingsCache.sprites[componentId] = settings;
        return this;
    };
    FX.prototype.initMovieClip = function (componentId, settings) {
        if (this._settingsCache.mcs[componentId])
            throw new Error("ComponentId '" + componentId + "' already exists.");
        this._settingsCache.mcs[componentId] = settings;
        return this;
    };
    FX.prototype.getMovieClips = function () {
        return this._settingsCache.mcs;
    };
    FX.prototype.getSprites = function () {
        return this._settingsCache.sprites;
    };
    FX.prototype.addContainer = function (key, container) {
        this.__containers[key] = container;
    };
    FX.prototype.getEffectSequence = function (name) {
        var settings = this._nameMaps.effectSequences[name];
        if (!settings)
            throw new Error("Settings not defined for '" + name + "'");
        return this.getEffectSequenceById(settings.id);
    };
    FX.prototype.getEffectSequenceById = function (componentId) {
        var pool = this._cache.effectSequences;
        var effectSequence;
        var settings = this._settingsCache.effectSequences[componentId];
        if (!settings)
            throw new Error("Settings not defined for '" + componentId + "'");
        if (pool.length == 0) {
            effectSequence = new EffectSequence_1.EffectSequence(componentId);
            effectSequence.__fx = this;
        }
        else {
            effectSequence = pool.pop();
        }
        effectSequence.__applySettings(settings);
        return effectSequence;
    };
    FX.prototype.getParticleEmitter = function (name, autoRecycleOnComplete, cloneSettings) {
        if (autoRecycleOnComplete === void 0) { autoRecycleOnComplete = true; }
        if (cloneSettings === void 0) { cloneSettings = false; }
        var settings = this._nameMaps.emitters[name];
        if (!settings)
            throw new Error("Settings not defined for '" + name + "'");
        return this.getParticleEmitterById(settings.id, autoRecycleOnComplete, cloneSettings);
    };
    FX.prototype.getParticleEmitterById = function (componentId, autoRecycleOnComplete, cloneSettings) {
        if (autoRecycleOnComplete === void 0) { autoRecycleOnComplete = true; }
        if (cloneSettings === void 0) { cloneSettings = false; }
        var pool = this._cache.emitters;
        var emitter;
        var settings = this._settingsCache.emitters[componentId];
        if (!settings)
            throw new Error("Settings not defined for '" + componentId + "'");
        if (pool.length == 0) {
            emitter = new ParticleEmitter_1.ParticleEmitter(componentId);
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
    };
    FX.prototype.stopEmitter = function (emitter, dispose) {
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
    FX.prototype.stopAllEffects = function () {
        var list = this._effects.toArray();
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var node = list_2[_i];
            node.recycle();
        }
    };
    FX.prototype.parseSpriteSheet = function (spriteSheet, filter) {
        return this.parseObject(spriteSheet.data.frames, filter);
    };
    FX.prototype.parseTextureCache = function (filter) {
        return this.parseObject(PIXI.utils.TextureCache, filter);
    };
    Object.defineProperty(FX.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    FX.prototype.__addActiveEffect = function (effect) {
        this._effects.add(effect);
    };
    FX.prototype.__removeActiveEffect = function (effect) {
        this._effects.remove(effect);
    };
    FX.prototype.__getSprite = function (componentId) {
        var cache = this._cache.sprites;
        var pool = cache[componentId];
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        if (pool.length == 0) {
            var settings = this._settingsCache.sprites[componentId];
            if (settings == null)
                throw new Error("Settings not defined for '" + componentId + "'");
            var sprite = new Sprite_1.Sprite(componentId, settings.texture, settings.anchorX, settings.anchorY);
            sprite.__fx = this;
            return sprite;
        }
        return pool.pop();
    };
    FX.prototype.__getMovieClip = function (componentId) {
        var cache = this._cache.mcs;
        var pool = cache[componentId];
        if (cache[componentId] == null) {
            pool = cache[componentId] = [];
        }
        if (pool.length == 0) {
            var settings = this._settingsCache.mcs[componentId];
            if (settings == null)
                throw new Error("Settings not defined for '" + componentId + "'");
            var mc = new MovieClip_1.MovieClip(componentId, settings.textures, settings.anchorX, settings.anchorY);
            mc.__fx = this;
            return mc;
        }
        return pool.pop();
    };
    FX.prototype.__getParticle = function () {
        var cache = this._cache, pool = cache.particles;
        if (pool.length == 0) {
            var particle = new Particle_1.Particle();
            particle.__fx = this;
            return particle;
        }
        return pool.pop();
    };
    FX.prototype.__getEmitterCore = function (type, emitter) {
        var cache = this._cache.cores;
        var pool = cache[type];
        if (pool == null) {
            pool = cache[type] = [];
        }
        if (pool.length == 0) {
            return new FX.__emitterCores[type](type);
        }
        return pool.pop();
    };
    FX.prototype.__recycleParticle = function (particle) {
        this._cache.particles.push(particle);
    };
    FX.prototype.__recycleSprite = function (componentId, object) {
        this._cache.sprites[componentId].push(object);
    };
    FX.prototype.__recycleMovieClip = function (componentId, object) {
        this._cache.mcs[componentId].push(object);
    };
    FX.prototype.__recycleEmitter = function (emitter) {
        this._effects.remove(emitter);
        this.__recycleEmitterCore(emitter.core);
        this._cache.emitters.push(emitter);
    };
    FX.prototype.__recycleEffectSequence = function (effectSequence) {
        this._effects.remove(effectSequence);
        this._cache.effectSequences.push(effectSequence);
    };
    FX.prototype.__recycleEmitterCore = function (core) {
        this._cache.cores[core.type].push(core);
    };
    FX.prototype.parseObject = function (object, filter) {
        var frames = object;
        var mcs = {};
        var result = { sprites: [], movieClips: [] };
        for (var i in frames) {
            if (filter && i.indexOf(filter) == -1) {
                continue;
            }
            this.initSprite(i, { texture: i, anchorX: 0.5, anchorY: 0.5 });
            result.sprites.push(i);
            if (i.substr(0, 3) == 'mc_') {
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
    FX.settingsVersion = 0;
    FX._bundleHash = '80c6df7fb0d3d898f34ce0031c037fef';
    FX.ComponentType = ComponentType;
    FX.EffectSequenceComponentType = EffectSequenceComponentType;
    FX.__emitterCores = {
        circle: CircleEmitterCore_1.CircleEmitterCore,
        box: BoxEmitterCore_1.BoxEmitterCore,
        ring: RingEmitterCore_1.RingEmitterCore
    };
    return FX;
}());
exports.FX = FX;
//# sourceMappingURL=FX.js.map