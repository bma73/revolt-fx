(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.revolt = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = require("./util/LinkedList");
var BaseEffect = (function (_super) {
    __extends(BaseEffect, _super);
    function BaseEffect(componentId) {
        var _this = _super.call(this) || this;
        _this.componentId = componentId;
        _this.exhausted = false;
        _this.completed = false;
        _this._x = 0;
        _this._y = 0;
        _this._rotation = 0;
        _this._alpha = 0;
        _this._scale = new PIXI.Point();
        _this._active = false;
        _this.__recycled = true;
        return _this;
    }
    BaseEffect.prototype.update = function (dt) {
    };
    BaseEffect.prototype.recycle = function () {
    };
    Object.defineProperty(BaseEffect.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            this._alpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseEffect.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: true,
        configurable: true
    });
    BaseEffect.prototype.__applySettings = function (value) {
    };
    return BaseEffect;
}(LinkedList_1.Node));
exports.BaseEffect = BaseEffect;

},{"./util/LinkedList":17}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FX_1 = require("./FX");
var BaseEffect_1 = require("./BaseEffect");
var LinkedList_1 = require("./util/LinkedList");
var ParticleEmitter_1 = require("./ParticleEmitter");
var Rnd_1 = require("./util/Rnd");
var FXSignal_1 = require("./util/FXSignal");
var EffectSequence = (function (_super) {
    __extends(EffectSequence, _super);
    function EffectSequence(componentId) {
        var _this = _super.call(this, componentId) || this;
        _this._elements = new LinkedList_1.LinkedList();
        _this.__on = {
            started: new FXSignal_1.FXSignal(),
            completed: new FXSignal_1.FXSignal(),
            exhausted: new FXSignal_1.FXSignal(),
            effectSpawned: new FXSignal_1.FXSignal(),
            triggerActivated: new FXSignal_1.FXSignal()
        };
        return _this;
    }
    EffectSequence.prototype.init = function (container, delay, autoStart, scaleMod) {
        if (delay === void 0) { delay = 0; }
        if (autoStart === void 0) { autoStart = true; }
        if (scaleMod === void 0) { scaleMod = 1; }
        this.container = container;
        this._scaleMod = scaleMod;
        this._delay = delay * 1000;
        if (autoStart)
            this.start();
        return this;
    };
    EffectSequence.prototype.start = function () {
        if (this._active)
            return;
        this._startTime = Date.now() + (this.settings.delay ? this.settings.delay * 1000 : 0) + this._delay;
        this._index = 0;
        if (this._list.length == 0) {
            this._active = false;
            if (this.__on.exhausted.__hasCallback) {
                this.__on.exhausted.dispatch(this);
            }
            if (this.__on.completed.__hasCallback) {
                this.__on.completed.dispatch(this);
            }
            this.recycle();
            return this;
        }
        this.exhausted = this.completed = false;
        this.setNextEffect();
        this.__fx.effectSequenceCount++;
        this.__fx.__addActiveEffect(this);
        if (this.__on.started.__hasCallback) {
            this.__on.started.dispatch(this);
        }
        return this;
    };
    EffectSequence.prototype.update = function (dt) {
        var t = Date.now();
        if (t < this._startTime)
            return;
        this._time += dt;
        if (!this.exhausted && t >= this._effectStartTime) {
            var fx = this.__fx;
            var def = this._nextEffectSettings;
            var effect = void 0;
            var node_1;
            switch (def.componentType) {
                case FX_1.FX.EffectSequenceComponentType.Sprite:
                    effect = fx.__getSprite(def.componentId);
                    var container = fx.__containers[def.containerId] || this.container;
                    container.addChild(effect);
                    effect.blendMode = fx.useBlendModes ? def.blendMode : 0;
                    effect.tint = def.tint;
                    effect.scale.set(Rnd_1.Rnd.float(def.scaleMin, def.scaleMax) * Rnd_1.Rnd.float(this.settings.scaleMin, this.settings.scaleMax) * this._scaleMod);
                    effect.alpha = Rnd_1.Rnd.float(def.alphaMin, def.alphaMax);
                    effect.anchor.set(def.componentParams.anchorX, def.componentParams.anchorY);
                    node_1 = new LinkedList_1.Node({ component: effect, endTime: t + (def.duration) * 1000 });
                    this._elements.add(node_1);
                    effect.x = this._x;
                    effect.y = this._y;
                    effect.rotation = this._rotation + Rnd_1.Rnd.float(def.rotationMin, def.rotationMax);
                    if (this.__on.effectSpawned.__hasCallback) {
                        this.__on.effectSpawned.dispatch(FX_1.FX.EffectSequenceComponentType.Sprite, effect);
                    }
                    break;
                case FX_1.FX.EffectSequenceComponentType.MovieClip:
                    effect = fx.__getMovieClip(def.componentId);
                    if (def.componentParams.loop) {
                        effect.animationSpeed = Rnd_1.Rnd.float(def.componentParams.animationSpeedMin || 1, def.componentParams.animationSpeedMax || 1);
                        effect.loop = def.componentParams.loop || false;
                    }
                    else {
                        var speed = def.duration;
                    }
                    effect.anchor.set(def.componentParams.anchorX, def.componentParams.anchorY);
                    effect.gotoAndPlay(0);
                    container = fx.__containers[def.containerId] || this.container;
                    container.addChild(effect);
                    effect.blendMode = fx.useBlendModes ? def.blendMode : 0;
                    effect.tint = def.tint;
                    effect.scale.set(Rnd_1.Rnd.float(def.scaleMin, def.scaleMax) * Rnd_1.Rnd.float(this.settings.scaleMin, this.settings.scaleMax) * this._scaleMod);
                    effect.alpha = Rnd_1.Rnd.float(def.alphaMin, def.alphaMax);
                    node_1 = new LinkedList_1.Node({ component: effect, endTime: t + (def.duration) * 1000 });
                    this._elements.add(node_1);
                    effect.x = this._x;
                    effect.y = this._y;
                    effect.rotation = this._rotation + Rnd_1.Rnd.float(def.rotationMin, def.rotationMax);
                    if (this.__on.effectSpawned.__hasCallback) {
                        this.__on.effectSpawned.dispatch(FX_1.FX.EffectSequenceComponentType.MovieClip, effect);
                    }
                    break;
                case FX_1.FX.EffectSequenceComponentType.Emitter:
                    effect = fx.getParticleEmitterById(def.componentId);
                    container = fx.__containers[def.containerId] || this.container;
                    effect.init(container, true, Rnd_1.Rnd.float(def.scaleMin, def.scaleMax) * Rnd_1.Rnd.float(this.settings.scaleMin, this.settings.scaleMax) * this._scaleMod);
                    node_1 = new LinkedList_1.Node({ component: effect, endTime: effect.endTime });
                    this._elements.add(node_1);
                    effect.x = this._x;
                    effect.y = this._y;
                    effect.rotation = this._rotation + effect.settings.rotation;
                    if (this.__on.effectSpawned.__hasCallback) {
                        this.__on.effectSpawned.dispatch(FX_1.FX.EffectSequenceComponentType.Emitter, effect);
                    }
                    break;
                case FX_1.FX.EffectSequenceComponentType.Trigger:
                    if (this.__on.triggerActivated.__hasCallback) {
                        this.__on.triggerActivated.dispatch(def.triggerValue);
                    }
                    break;
            }
            if (this._index == this._list.length) {
                this.exhausted = true;
                if (this.__on.exhausted.__hasCallback) {
                    this.__on.exhausted.dispatch(this);
                }
            }
            else {
                this.setNextEffect();
            }
        }
        var list = this._elements;
        var node = list.first;
        while (node) {
            node.update(dt);
            if (t > node.data.endTime) {
                var component = node.data.component;
                if (component instanceof ParticleEmitter_1.ParticleEmitter) {
                    if (component.completed) {
                        list.remove(node);
                    }
                }
                else {
                    list.remove(node);
                    component.recycle();
                }
            }
            node = node.next;
        }
        if (this.exhausted && list.length == 0) {
            this._active = false;
            this.completed = true;
            if (this.__on.completed.__hasCallback) {
                this.__on.completed.dispatch(this);
            }
            this.recycle();
        }
    };
    EffectSequence.prototype.stop = function () {
        this.recycle();
    };
    EffectSequence.prototype.recycle = function () {
        if (this.__recycled)
            return;
        var list = this._elements;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            node.data.component.recycle();
            node = next;
        }
        var on = this.__on;
        if (on.completed.__hasCallback)
            on.completed.removeAll();
        if (on.started.__hasCallback)
            on.started.removeAll();
        if (on.exhausted.__hasCallback)
            on.exhausted.removeAll();
        if (on.effectSpawned.__hasCallback)
            on.effectSpawned.removeAll();
        if (on.triggerActivated.__hasCallback)
            on.triggerActivated.removeAll();
        list.clear();
        this.__recycled = true;
        this._x = this._y = this._rotation = 0;
        this.__fx.effectSequenceCount--;
        this.__fx.__recycleEffectSequence(this);
    };
    EffectSequence.prototype.dispose = function () {
        this._elements.clear();
        this.__fx = null;
        var on = this.__on;
        on.completed = on.started = on.exhausted = on.effectSpawned = on.triggerActivated = null;
    };
    Object.defineProperty(EffectSequence.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = value;
            var list = this._elements;
            var node = list.first;
            var next;
            while (node) {
                next = node.next;
                node.data.rotation = value;
                node = next;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectSequence.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            var list = this._elements;
            var node = list.first;
            var next;
            while (node) {
                next = node.next;
                node.data.x = value;
                node = next;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectSequence.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
            var list = this._elements;
            var node = list.first;
            var next;
            while (node) {
                next = node.next;
                node.data.y = value;
                node = next;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EffectSequence.prototype, "on", {
        get: function () {
            return this.__on;
        },
        enumerable: true,
        configurable: true
    });
    EffectSequence.prototype.setNextEffect = function () {
        if (this.exhausted)
            return;
        var def = this._nextEffectSettings = this._list[this._index++];
        this._effectStartTime = this._startTime + def.delay * 1000;
    };
    EffectSequence.prototype.__applySettings = function (value) {
        this.settings = value;
        this.name = value.name;
        this._list = value.effects.slice();
        this.__recycled = false;
    };
    return EffectSequence;
}(BaseEffect_1.BaseEffect));
exports.EffectSequence = EffectSequence;

},{"./BaseEffect":1,"./FX":3,"./ParticleEmitter":6,"./util/FXSignal":16,"./util/LinkedList":17,"./util/Rnd":18}],3:[function(require,module,exports){
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

},{"./EffectSequence":2,"./MovieClip":4,"./Particle":5,"./ParticleEmitter":6,"./Sanitizer":7,"./Sprite":8,"./core/BoxEmitterCore":10,"./core/CircleEmitterCore":11,"./core/RingEmitterCore":12,"./util/LinkedList":17}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MovieClip = (function (_super) {
    __extends(MovieClip, _super);
    function MovieClip(componentId, textures, anchorX, anchorY) {
        var _this = this;
        var t = [];
        var l = textures.length;
        for (var i = 0; i < l; i++) {
            t.push(PIXI.Texture.fromFrame(textures[i]));
        }
        _this = _super.call(this, t) || this;
        _this.componentId = componentId;
        _this.anchor.set(0.5, 0.5);
        _this.loop = false;
        _this.__sequenceEndTime = 0;
        return _this;
    }
    MovieClip.prototype.recycle = function () {
        this.alpha = 1;
        this.tint = 0xffffff;
        this.transform.rotation = 0;
        this.transform.scale.set(1);
        if (this.parent)
            this.parent.removeChild(this);
        this.gotoAndStop(0);
        this.__fx.__recycleMovieClip(this.componentId, this);
    };
    MovieClip.prototype.dispose = function () {
        if (this.parent)
            this.parent.removeChild(this);
        this.__fx = null;
        this.gotoAndStop(0);
        this.destroy();
    };
    return MovieClip;
}(PIXI.extras.AnimatedSprite));
exports.MovieClip = MovieClip;

},{}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = require("./util/LinkedList");
var Color_1 = require("./util/Color");
var Easing_1 = require("./util/Easing");
var Rnd_1 = require("./util/Rnd");
var FXSignal_1 = require("./util/FXSignal");
var Particle = (function (_super) {
    __extends(Particle, _super);
    function Particle() {
        var _this = _super.call(this) || this;
        _this.dx = 0;
        _this.dy = 0;
        _this._childEmitters = [];
        _this._hasChildEmitters = false;
        _this._spawnOnHalfway = false;
        _this.__recycled = true;
        _this.__on = {
            died: new FXSignal_1.FXSignal(),
            bounced: new FXSignal_1.FXSignal(),
            updated: new FXSignal_1.FXSignal()
        };
        _this._color = new Color_1.Color();
        return _this;
    }
    Particle.prototype.init = function (emitter, settings, scaleMod) {
        var component = this.component;
        var transform = component.transform;
        var fx = this.__fx;
        this.emitter = emitter;
        this.settings = settings;
        var duration = this.duration = Rnd_1.Rnd.float(settings.durationMin, settings.durationMax) * scaleMod;
        this._dt = 1 / this.duration;
        this.time = 0;
        this.__recycled = false;
        settings.addOnTop ? emitter.container.addChild(component) : emitter.container.addChildAt(component, 0);
        component.blendMode = fx.useBlendModes ? (settings.blendMode) : 0;
        this.startX = transform.position.x;
        this.startY = transform.position.y;
        this.useGravity = emitter.settings.useGravity;
        this.useScale = settings.useScale;
        this.useRotation = settings.useRotation;
        this.useAlpha = settings.useAlpha;
        this.useTint = settings.useTint;
        this.useSpawns = settings.useSpawns;
        this.useChilds = settings.useChilds;
        this.useMotion = settings.useMotion;
        if (this.useGravity) {
            this.gravity = emitter.settings.gravity;
            this.useFloor = emitter.settings.useFloor;
            this.floorY = emitter.settings.floorY;
            this.bounceFac = Rnd_1.Rnd.float(settings.bounceFacMin, settings.bounceFacMax) * scaleMod;
            this.friction = 1 - Rnd_1.Rnd.float(settings.frictionMin, settings.frictionMax) * scaleMod;
            this._spawnOnBounce = settings.spawn.onBounce.length > 0;
            this.useAlign = settings.align;
            if (settings.useMotion) {
                var speed = Rnd_1.Rnd.float(settings.moveSpeedMin, settings.moveSpeedMax);
                this.moveSpeedX = speed * this.dx * scaleMod;
                this.moveSpeedY = speed * this.dy * scaleMod;
            }
            else {
                this.moveSpeedX = this.moveSpeedY = 0;
            }
        }
        else {
            if (settings.useMotion) {
                var d = this.distance = Rnd_1.Rnd.integer(settings.distanceMin, settings.distanceMax) * 0.8 * scaleMod;
                this.deltaX = ((transform.position.x + d * this.dx) - this.startX) * 0.8;
                this.deltaY = ((transform.position.y + d * this.dy) - this.startY) * 0.8;
                this.distanceEase = Easing_1.Easing[settings.distanceEase];
                this.useAlign = false;
            }
            else {
                transform.position.x = this.startX;
                transform.position.y = this.startY;
            }
        }
        if (settings.useRotation && settings.randomStartRotation && !this.useAlign) {
            transform.rotation = Rnd_1.Rnd.float(0, 6.28319);
        }
        if (settings.useAlpha) {
            this.alphaStart = component.alpha = Rnd_1.Rnd.float(settings.alphaStartMin, settings.alphaStartMax);
            this.alphaDelta = Rnd_1.Rnd.float(settings.alphaEndMin, settings.alphaEndMax) - this.alphaStart;
            this.alphaEase = Easing_1.Easing[settings.alphaEase] || null;
            this.useFadeIn = settings.fadeIn;
            if (settings.fadeIn) {
                this.alphaDuration = duration * (1 - settings.fadeInDurationFac);
                this.fadeInDuration = duration * settings.fadeInDurationFac;
                this.fadeInEase = Easing_1.Easing[settings.fadeInEase || 'easeInSine'];
            }
        }
        if (settings.useScale) {
            this.uniformScale = settings.uniformScale;
            this.useScaleIn = settings.scaleIn;
            if (settings.useScale) {
                this.uniformScale = settings.uniformScale;
                this.scaleEase = Easing_1.Easing[settings.scaleEase];
                if (settings.uniformScale) {
                    this.scaleStart = transform.scale.x = transform.scale.y = Rnd_1.Rnd.float(settings.scaleStartMin, settings.scaleStartMax) * scaleMod;
                    this.scaleDelta = (Rnd_1.Rnd.float(settings.scaleEndMin, settings.scaleEndMax) - this.scaleStart) * scaleMod;
                }
                else {
                    this.scaleXStart = transform.scale.x = Rnd_1.Rnd.float(settings.scaleXStartMin, settings.scaleXStartMax) * scaleMod;
                    this.scaleXDelta = (Rnd_1.Rnd.float(settings.scaleXEndMin, settings.scaleXEndMax) - this.scaleXStart) * scaleMod;
                    this.scaleXEase = Easing_1.Easing[settings.scaleXEase];
                    this.scaleYStart = transform.scale.y = Rnd_1.Rnd.float(settings.scaleYStartMin, settings.scaleYStartMax) * scaleMod;
                    this.scaleYDelta = (Rnd_1.Rnd.float(settings.scaleYEndMin, settings.scaleYEndMax) - this.scaleYStart) * scaleMod;
                    this.scaleYEase = Easing_1.Easing[settings.scaleYEase];
                }
                if (settings.scaleIn) {
                    this.scaleDuration = duration * (1 - settings.scaleInDurationFac);
                    this.scaleInDuration = duration * settings.scaleInDurationFac;
                    this.scaleInEase = Easing_1.Easing[settings.scaleInEase || 'easeInSine'];
                }
            }
            else {
                if (settings.uniformScale) {
                    transform.scale.x = settings.scaleStartMin;
                    transform.scale.y = settings.scaleStartMin;
                }
                else {
                    transform.scale.x = settings.scaleXStartMin;
                    transform.scale.y = settings.scaleYStartMin;
                }
            }
        }
        if (settings.useRotation) {
            this.rotationSpeed = Rnd_1.Rnd.float(settings.rotationSpeedMin, settings.rotationSpeedMax) * scaleMod;
            if (settings.randomRotationDirection)
                this.rotationSpeed *= Rnd_1.Rnd.sign();
        }
        if (settings.useTint) {
            this.tintEase = Easing_1.Easing[settings.tintEase];
            this._color.setRgb(settings.tintStart, settings.tintEnd);
        }
        if (settings.useChilds) {
            this._childEmitters.length = 0;
            var l = settings.childs.length;
            this._hasChildEmitters = l > 0;
            if (this._childEmitters) {
                while (--l > -1) {
                    var def = settings.childs[l];
                    var em = fx.getParticleEmitterById(def.id);
                    em.init(emitter.container, true, (def.scale || 1) * (scaleMod || 1));
                    if (def.adoptRotation) {
                        em.rotation = transform.rotation;
                        em.__adoptRotation = true;
                    }
                    em.__parent = this;
                    this._childEmitters.push(em);
                }
            }
        }
        if (settings.useSpawns) {
            if (settings.spawn.onStart.length > 0) {
                emitter.__subSpawn(this, settings.spawn.onStart);
            }
            this._spawnOnHalfway = settings.spawn.onHalfway.length > 0;
        }
        if (emitter.__on.particleSpawned.__hasCallback) {
            emitter.__on.particleSpawned.dispatch(this);
        }
        return this;
    };
    Particle.prototype.update = function (dt) {
        var t = this.time += dt;
        var duration = this.duration;
        if (t >= duration) {
            this.emitter.__removeParticle(this);
            return;
        }
        var component = this.component;
        var transform = component.transform;
        var mod = t * dt;
        if (this.useGravity) {
            var dt2 = dt / 0.0166666;
            transform.position.x += this.moveSpeedX * dt2;
            transform.position.y += this.moveSpeedY * dt2;
            this.moveSpeedY += this.gravity * dt2;
            if (this.useAlign) {
                transform.rotation = Math.atan2(this.moveSpeedY, this.moveSpeedX);
            }
            if (this.useFloor && this.floorY > 0) {
                if (transform.position.y > this.floorY) {
                    transform.position.y = this.floorY;
                    this.moveSpeedY *= -this.bounceFac;
                    this.moveSpeedX *= this.friction;
                    if (this.useSpawns && this._spawnOnBounce) {
                        this.emitter.__subSpawn(this, this.settings.spawn.onBounce);
                    }
                    var emitter = this.emitter;
                    if (emitter.__on.particleBounced.__hasCallback) {
                        emitter.__on.particleBounced.dispatch(this);
                    }
                    if (this.__on.bounced.__hasCallback) {
                        this.__on.bounced.dispatch(this);
                    }
                    if (this.settings.stopOnBounce) {
                        emitter.__removeParticle(this);
                    }
                    return;
                }
            }
        }
        else if (this.useMotion) {
            if (this.distanceEase) {
                transform.position.x = this.distanceEase(t, this.startX, this.deltaX, duration);
                transform.position.y = this.distanceEase(t, this.startY, this.deltaY, duration);
            }
            else {
                transform.position.x = this.deltaX * mod + this.startX;
                transform.position.y = this.deltaY * mod + this.startY;
            }
        }
        if (this.useAlpha) {
            if (this.useFadeIn) {
                if (t < this.fadeInDuration) {
                    component.alpha = this.fadeInEase(t, 0, this.alphaStart, this.fadeInDuration);
                }
                else {
                    component.alpha = this.alphaEase(t - this.fadeInDuration, this.alphaStart, this.alphaDelta, this.alphaDuration);
                }
            }
            else {
                if (this.alphaEase) {
                    component.alpha = this.alphaEase(t, this.alphaStart, this.alphaDelta, duration);
                }
                else {
                    component.alpha = (this.alphaDelta) * mod + this.alphaStart;
                }
            }
        }
        if (this.useRotation) {
            transform.rotation += this.rotationSpeed;
        }
        if (this.useScale) {
            if (this.uniformScale) {
                if (this.useScaleIn) {
                    if (t < this.scaleInDuration) {
                        transform.scale.x = transform.scale.y = this.scaleInEase(t, 0, this.scaleStart, this.scaleInDuration);
                    }
                    else {
                        transform.scale.x = transform.scale.y = this.scaleEase(t - this.scaleInDuration, this.scaleStart, this.scaleDelta, this.scaleDuration);
                    }
                }
                else {
                    if (this.scaleEase) {
                        transform.scale.x = this.scaleEase(t, this.scaleStart, this.scaleDelta, duration);
                        transform.scale.y = this.scaleEase(t, this.scaleStart, this.scaleDelta, duration);
                    }
                    else {
                        transform.scale.x = transform.scale.y = this.scaleDelta * mod + this.scaleStart;
                    }
                }
            }
            else {
                if (this.useScaleIn) {
                    if (t < this.scaleInDuration) {
                        transform.scale.x = this.scaleInEase(t, 0, this.scaleXStart, this.scaleInDuration);
                        transform.scale.y = this.scaleInEase(t, 0, this.scaleYStart, this.scaleInDuration);
                    }
                    else {
                        transform.scale.x = this.scaleEase(t - this.scaleInDuration, this.scaleXStart, this.scaleXDelta, this.scaleDuration);
                        transform.scale.y = this.scaleEase(t - this.scaleInDuration, this.scaleYStart, this.scaleYDelta, this.scaleDuration);
                    }
                }
                else {
                    if (this.scaleXEase) {
                        transform.scale.x = this.scaleXEase(t, this.scaleXStart, this.scaleXDelta, duration);
                    }
                    else {
                        transform.scale.x = this.scaleXDelta * mod + this.scaleXStart;
                    }
                    if (this.scaleYEase) {
                        transform.scale.y = this.scaleYEase(t, this.scaleYStart, this.scaleYDelta, duration);
                    }
                    else {
                        transform.scale.y = this.scaleYDelta * mod + this.scaleYStart;
                    }
                }
            }
        }
        if (this.useTint) {
            component.tint = this._color.tween(this.tintEase, t, duration);
        }
        if (this._spawnOnHalfway) {
            if (t >= 0.5) {
                this._spawnOnHalfway = false;
                this.emitter.__subSpawn(this, this.settings.spawn.onHalfway);
            }
        }
        if (this.useChilds && this._hasChildEmitters) {
            var childs = this._childEmitters;
            var l = childs.length;
            while (--l > -1) {
                var child = childs[l];
                if (child.__recycled)
                    continue;
                child.x = component.position.x;
                child.y = transform.position.y;
                if (child.__adoptRotation) {
                    child.rotation = transform.rotation;
                }
            }
        }
        if (this.emitter.__on.particleUpdated.__hasCallback) {
            this.emitter.__on.particleUpdated.dispatch(this);
        }
        if (this.__on.updated.__hasCallback) {
            this.__on.updated.dispatch(this);
        }
    };
    Particle.prototype.stop = function () {
        this.time = this.duration;
    };
    Particle.prototype.recycle = function () {
        if (this.emitter.__on.particleDied.__hasCallback) {
            this.emitter.__on.particleDied.dispatch(this);
        }
        var on = this.__on;
        if (on.died.__hasCallback) {
            on.died.dispatch(this);
            on.died.removeAll();
        }
        if (on.updated.__hasCallback) {
            on.updated.removeAll();
        }
        if (on.bounced.__hasCallback) {
            on.bounced.removeAll();
        }
        if (this._hasChildEmitters) {
            var childs = this._childEmitters;
            var l = childs.length;
            while (--l > -1) {
                childs[l].stop(true);
            }
            this._childEmitters.length = 0;
            this._hasChildEmitters = false;
        }
        this.component.recycle();
        this.__fx.__recycleParticle(this);
        this.dx = this.dy = this.deltaX = this.deltaY = 0;
        this.component = null;
        this.emitter = null;
        this.settings = null;
        this.__recycled = true;
    };
    Particle.prototype.dispose = function () {
        this.recycle();
        this.__fx = null;
    };
    Object.defineProperty(Particle.prototype, "x", {
        get: function () {
            return this.component.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "y", {
        get: function () {
            return this.component.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "on", {
        get: function () {
            return this.__on;
        },
        enumerable: true,
        configurable: true
    });
    Particle.prototype.__removeChildEmitter = function (emitter) {
        var index = this._childEmitters.indexOf(emitter);
        if (index > -1) {
            this._childEmitters.splice(index, 1);
            if (this._childEmitters.length == 0)
                this._hasChildEmitters = false;
        }
    };
    return Particle;
}(LinkedList_1.Node));
exports.Particle = Particle;

},{"./util/Color":14,"./util/Easing":15,"./util/FXSignal":16,"./util/LinkedList":17,"./util/Rnd":18}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEffect_1 = require("./BaseEffect");
var LinkedList_1 = require("./util/LinkedList");
var Rnd_1 = require("./util/Rnd");
var FXSignal_1 = require("./util/FXSignal");
var ParticleEmitter = (function (_super) {
    __extends(ParticleEmitter, _super);
    function ParticleEmitter(componentId) {
        var _this = _super.call(this, componentId) || this;
        _this.targetOffset = 0;
        _this.autoRecycleOnComplete = true;
        _this._particles = new LinkedList_1.LinkedList();
        _this._particleCount = 0;
        _this._childEmitters = [];
        _this._hasChildEmitters = false;
        _this._paused = false;
        _this.__adoptRotation = false;
        _this.__on = {
            started: new FXSignal_1.FXSignal(),
            completed: new FXSignal_1.FXSignal(),
            exhausted: new FXSignal_1.FXSignal(),
            particleUpdated: new FXSignal_1.FXSignal(),
            particleSpawned: new FXSignal_1.FXSignal(),
            particleBounced: new FXSignal_1.FXSignal(),
            particleDied: new FXSignal_1.FXSignal()
        };
        return _this;
    }
    ParticleEmitter.prototype.init = function (container, autoStart, scaleMod) {
        if (autoStart === void 0) { autoStart = true; }
        if (scaleMod === void 0) { scaleMod = 1; }
        this.container = container;
        this.core.__scaleMod = this._scaleMod = scaleMod;
        if (autoStart)
            this.start();
        return this;
    };
    ParticleEmitter.prototype.start = function () {
        if (this._active)
            return;
        var t = Date.now();
        var s = this.settings;
        var RX = this.__fx;
        RX.emitterCount++;
        this.infinite = s.infinite;
        this._time = Number.MAX_VALUE;
        if (s.duration > 0) {
            this.endTime = t + s.duration * 1000;
        }
        else {
            this.endTime = s.duration;
        }
        this._nextSpawnTime = 0;
        this._particleCount = 0;
        this._active = true;
        this.exhausted = this.completed = false;
        RX.__addActiveEffect(this);
        var l = s.childs.length;
        this._hasChildEmitters = l > 0;
        if (this._hasChildEmitters) {
            while (--l > -1) {
                var def = s.childs[l];
                var em = RX.getParticleEmitterById(def.id);
                var container = RX.__containers[em.settings.containerId] || this.container;
                em.init(container, true, (def.scale || 1) * (this._scaleMod || 1));
                if (def.adoptRotation) {
                    em.rotation = this._rotation;
                    em.__adoptRotation = true;
                }
                em.__parent = this;
                this._childEmitters.push(em);
            }
        }
        this.rotation = this._rotation;
        if (this.__on.started.__hasCallback) {
            this.__on.started.dispatch(this);
        }
        return this;
    };
    ParticleEmitter.prototype.stop = function (waitForParticles) {
        if (waitForParticles === void 0) { waitForParticles = true; }
        if (waitForParticles) {
            this.exhausted = true;
            if (this._hasChildEmitters) {
                this.stopChildEmitters(true);
            }
        }
        else {
            if (this.__on.completed.__hasCallback) {
                this.__on.completed.dispatch(this);
            }
            if (this.autoRecycleOnComplete) {
                this.recycle();
            }
            else {
                this.recycleParticles();
                this.completed = true;
                this._active = false;
                this.__fx.__removeActiveEffect(this);
            }
        }
    };
    ParticleEmitter.prototype.update = function (dt) {
        if (!this._active)
            return;
        var t = Date.now();
        if (!this.exhausted) {
            if (this.settings.autoRotation !== 0) {
                this.rotation += this.settings.autoRotation * (dt / 0.016666);
            }
            if (this.target) {
                this.rotation = this.target.rotation;
                if (this.targetOffset == 0) {
                    this.x = this.target.x;
                    this.y = this.target.y;
                }
                else {
                    this.x = this.target.x + Math.cos(this._rotation) * this.targetOffset;
                    this.y = this.target.y + Math.sin(this._rotation) * this.targetOffset;
                }
            }
            if (this.endTime == 0 && !this.infinite) {
                this.spawn();
                this.exhausted = true;
            }
            else if (this.infinite || t < this.endTime) {
                this._time += dt;
                if (this._time >= this._nextSpawnTime) {
                    this._time = 0;
                    this.spawn();
                    this._nextSpawnTime = this._time + Rnd_1.Rnd.float(this.settings.spawnFrequencyMin, this.settings.spawnFrequencyMax);
                }
            }
            else {
                this.exhausted = true;
                if (this.__on.exhausted.__hasCallback) {
                    this.__on.exhausted.dispatch(this);
                }
            }
        }
        else {
            if (this._particleCount == 0) {
                this._active = false;
                this.completed = true;
                if (this.__on.completed.__hasCallback) {
                    this.__on.completed.dispatch(this);
                }
                this.__fx.__removeActiveEffect(this);
                if (this.autoRecycleOnComplete)
                    this.recycle();
            }
        }
        var list = this._particles;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            node.update(dt);
            node = next;
        }
        return this;
    };
    ParticleEmitter.prototype.spawn = function () {
        if (this._paused)
            return;
        var s = this.settings;
        var fx = this.__fx;
        var n = Rnd_1.Rnd.integer(s.spawnCountMin, s.spawnCountMax) * fx.particleFac;
        this.core.prepare(n);
        while (--n > -1) {
            if (this._particleCount >= s.maxParticles || fx.particleCount >= fx.maxParticles)
                return;
            var ps = s.particleSettings;
            var p = fx.__getParticle();
            var component = void 0;
            switch (ps.componentType) {
                case 0:
                    p.componentId = ps.componentId;
                    component = fx.__getSprite(p.componentId);
                    break;
                case 1:
                    p.componentId = ps.componentId;
                    component = fx.__getMovieClip(p.componentId);
                    if (ps.componentParams) {
                        component.loop = ps.componentParams.loop == null || !ps.componentParams.loop ? false : true;
                        component.animationSpeed = Rnd_1.Rnd.float(ps.componentParams.animationSpeedMin || 1, ps.componentParams.animationSpeedMax || 1);
                    }
                    component.gotoAndPlay(0);
                    break;
            }
            component.anchor.set(ps.componentParams.anchorX, ps.componentParams.anchorY);
            p.component = component;
            this.core.emit(p);
            p.init(this, ps, this._scaleMod);
            this._particles.add(p);
            this._particleCount++;
            fx.particleCount++;
        }
        this.core.step();
        this._nextSpawnTime = Rnd_1.Rnd.float(s.spawnFrequencyMin, s.spawnFrequencyMax);
        return this;
    };
    ParticleEmitter.prototype.recycle = function () {
        if (this.__recycled)
            return;
        if (this.__parent) {
            this.__parent.__removeChildEmitter(this);
            this.__parent = null;
        }
        this.recycleParticles();
        this.settings = null;
        this._active = false;
        this._paused = false;
        this.completed = true;
        this._x = this._y = this._rotation = 0;
        if (this._hasChildEmitters) {
            this.stopChildEmitters(true);
            this._childEmitters.length = 0;
            this._hasChildEmitters = false;
        }
        this.__fx.emitterCount--;
        this.__fx.__recycleEmitter(this);
        this.__recycled = true;
        this.__adoptRotation = false;
        this.core = null;
        this.target = null;
        this.name = null;
        var on = this.__on;
        if (on.completed.__hasCallback)
            on.completed.removeAll();
        if (on.started.__hasCallback)
            on.started.removeAll();
        if (on.exhausted.__hasCallback)
            on.exhausted.removeAll();
        if (on.particleBounced.__hasCallback)
            on.particleBounced.removeAll();
        if (on.particleDied.__hasCallback)
            on.particleDied.removeAll();
        if (on.particleSpawned.__hasCallback)
            on.particleSpawned.removeAll();
        if (on.particleUpdated.__hasCallback)
            on.particleUpdated.removeAll();
    };
    ParticleEmitter.prototype.dispose = function () {
        var list = this._particles;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            node.recycle();
            node = next;
        }
        list.clear();
        this.__recycled = true;
        if (this._hasChildEmitters) {
            this.stopChildEmitters(false);
        }
        this.__fx.particleCount -= this._particleCount;
        this._particles = null;
        this.componentId = null;
        this.settings = null;
        this._active = false;
        this.completed = true;
        this._childEmitters = null;
        if (this.core) {
            this.core.dispose();
        }
        this.core = null;
        this.target = null;
        this.name = null;
        var on = this.__on;
        on.completed.removeAll();
        on.started.removeAll();
        on.exhausted.removeAll();
        on.particleBounced.removeAll();
        on.particleDied.removeAll();
        on.particleSpawned.removeAll();
        on.particleUpdated.removeAll();
        this.__parent = null;
        this.__fx.__removeActiveEffect(this);
        this.__fx = null;
    };
    Object.defineProperty(ParticleEmitter.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = this.core.x = value;
            if (!this._xPosIntialized) {
                this.core.__x = value;
                this._xPosIntialized = true;
            }
            if (this._hasChildEmitters) {
                var childs = this._childEmitters;
                var l = childs.length;
                while (--l > -1) {
                    childs[l].x = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = this.core.y = value;
            if (!this._yPosIntialized) {
                this.core.__y = value;
                this._yPosIntialized = true;
            }
            if (this._hasChildEmitters) {
                var childs = this._childEmitters;
                var l = childs.length;
                while (--l > -1) {
                    childs[l].y = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = this.core.rotation = value;
            if (this._hasChildEmitters) {
                var childs = this._childEmitters;
                var l = childs.length;
                while (--l > -1) {
                    var child = childs[l];
                    if (child.__adoptRotation) {
                        child.rotation = child.settings.rotation + value;
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "paused", {
        get: function () {
            return this._paused;
        },
        set: function (value) {
            this._paused = value;
            if (this._hasChildEmitters) {
                var childs = this._childEmitters;
                var l = childs.length;
                while (--l > -1) {
                    childs[l].paused = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "on", {
        get: function () {
            return this.__on;
        },
        enumerable: true,
        configurable: true
    });
    ParticleEmitter.prototype.recycleParticles = function () {
        var node = this._particles.first;
        var next;
        while (node) {
            next = node.next;
            node.recycle();
            node = next;
        }
        this._particles.clear();
        this.__fx.particleCount -= this._particleCount;
    };
    ParticleEmitter.prototype.stopChildEmitters = function (waitForParticles) {
        var childs = this._childEmitters;
        var l = childs.length;
        while (--l > -1) {
            childs[l].stop(waitForParticles);
        }
    };
    ParticleEmitter.prototype.__removeParticle = function (particle) {
        if (particle.useSpawns && this._spawnOnComplete) {
            this.__subSpawn(particle, this.settings.particleSettings.spawn.onComplete);
        }
        this._particles.remove(particle);
        this._particleCount--;
        this.__fx.particleCount--;
        particle.recycle();
    };
    ParticleEmitter.prototype.__removeChildEmitter = function (emitter) {
        var index = this._childEmitters.indexOf(emitter);
        if (index > -1) {
            this._childEmitters.splice(index, 1);
            if (this._childEmitters.length == 0)
                this._hasChildEmitters = false;
        }
    };
    ParticleEmitter.prototype.__subSpawn = function (particle, list) {
        var fx = this.__fx;
        if (list) {
            var l = list.length;
            while (--l > -1) {
                var def = list[l];
                var component = void 0;
                var container = void 0;
                switch (def.type) {
                    case 0:
                        component = fx.getParticleEmitterById(def.id);
                        container = fx.__containers[component.settings.containerId] || this.container;
                        component.init(container, true, (def.scale || 1) * this._scaleMod);
                        if (def.adoptRotation) {
                            component.rotation = particle.component.rotation + component.settings.rotation;
                            component.__adoptRotation = true;
                        }
                        else {
                            component.rotation = component.settings.rotation;
                        }
                        break;
                    case 1:
                        component = fx.getEffectSequenceById(def.id);
                        container = fx.__containers[component.settings.containerId] || this.container;
                        component.init(container, 0, true, (def.scale || 1) * this._scaleMod);
                        if (def.adoptRotation) {
                            component.rotation = particle.component.rotation;
                        }
                        break;
                }
                component.x = particle.component.x;
                component.y = particle.component.y;
            }
        }
    };
    ParticleEmitter.prototype.__applySettings = function (value) {
        var fx = this.__fx;
        this.__recycled = this._xPosIntialized = this._yPosIntialized = false;
        this.settings = value;
        this.core = fx.__getEmitterCore(value.core.type, this);
        this.core.init(this);
        this.rotation = value.rotation;
        this.name = value.name;
        this._spawnOnComplete = value.particleSettings.spawn.onComplete.length > 0;
        this._childEmitters.length = 0;
    };
    ParticleEmitter.prototype.__setCore = function (type) {
        this.core = this.__fx.__getEmitterCore(type, this);
        this.core.init(this);
        this.core.__scaleMod = this._scaleMod;
        this._xPosIntialized = this._yPosIntialized = false;
    };
    return ParticleEmitter;
}(BaseEffect_1.BaseEffect));
exports.ParticleEmitter = ParticleEmitter;

},{"./BaseEffect":1,"./util/FXSignal":16,"./util/LinkedList":17,"./util/Rnd":18}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sanitizer = (function () {
    function Sanitizer() {
    }
    Sanitizer.sanitizeBundle = function (bundle) {
        for (var _i = 0, _a = bundle.emitters; _i < _a.length; _i++) {
            var emitter = _a[_i];
            var structure = Sanitizer._presetStructure.emitter;
            Sanitizer.parse(emitter, structure, Sanitizer._presetStructure.emitterSpawn);
        }
        for (var _b = 0, _c = bundle.sequences; _b < _c.length; _b++) {
            var sequence = _c[_b];
            var structure = Sanitizer._presetStructure.sequence;
            Sanitizer.parse(sequence, structure, Sanitizer._presetStructure.sequenceEffect);
        }
    };
    Sanitizer.parse = function (bundleObject, structureObject, spawnStructureObject) {
        for (var propName in structureObject) {
            if (bundleObject[propName] == null) {
                bundleObject[propName] = structureObject[propName];
            }
            else {
                var bundleProp = bundleObject[propName];
                if (typeof bundleProp !== 'object')
                    continue;
                var structureProp = structureObject[propName];
                if (!bundleProp.hasOwnProperty('length')) {
                    Sanitizer.parse(bundleProp, structureProp, spawnStructureObject);
                }
                else {
                    for (var _i = 0, bundleProp_1 = bundleProp; _i < bundleProp_1.length; _i++) {
                        var spawn = bundleProp_1[_i];
                        for (var spawnPropName in spawnStructureObject) {
                            if (spawn[spawnPropName] == null) {
                                spawn[spawnPropName] = spawnStructureObject[spawnPropName];
                            }
                        }
                    }
                }
            }
        }
    };
    Sanitizer._presetStructure = {
        sequence: {
            id: 0,
            name: '',
            type: 1,
            delay: 0,
            scaleMin: 1,
            scaleMax: 1,
            effects: []
        },
        sequenceEffect: {
            id: 0,
            componentId: null,
            componentType: 0,
            delay: 0,
            componentParams: {
                animationSpeedMin: 1,
                animationSpeedMax: 1,
                anchorX: 0.5,
                anchorY: 0.5,
                loop: false
            },
            scaleMin: 1,
            scaleMax: 1,
            alphaMin: 1,
            alphaMax: 1,
            rotationMin: 0,
            rotationMax: 0,
            blendMode: 0,
            duration: 0.1,
            tint: 0xffffff,
            containerId: '',
            triggerValue: ''
        },
        emitter: {
            id: 0,
            name: '',
            type: 0,
            core: {
                type: 'circle',
                params: {
                    radius: 100,
                    radial: true,
                    angle: 6.28318530718,
                    uniform: false,
                    width: 100,
                    height: 100
                }
            },
            spawnFrequencyMin: 0.1,
            spawnFrequencyMax: 0.1,
            maxParticles: 1000,
            spawnCountMin: 1,
            spawnCountMax: 1,
            duration: 0,
            infinite: true,
            useGravity: false,
            gravity: 0,
            useFloor: false,
            floorY: 700,
            rotation: 0,
            autoRotation: 0,
            particleSettings: {
                componentType: 0,
                componentId: '',
                componentParams: {
                    animationSpeedMin: 1,
                    animationSpeedMax: 1,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    loop: false
                },
                durationMin: 1,
                durationMax: 2,
                distanceMin: 0,
                distanceMax: 0,
                distanceEase: 'linear',
                moveSpeedMin: 0,
                moveSpeedMax: 0,
                bounceFacMin: 0,
                bounceFacMax: 0,
                frictionMin: 0,
                frictionMax: 0,
                useMotion: false,
                useRotation: false,
                useAlpha: false,
                useScale: false,
                useTint: false,
                useChilds: false,
                useSpawns: false,
                stopOnBounce: false,
                align: false,
                blendMode: 1,
                addOnTop: true,
                rotationSpeedMin: 0,
                rotationSpeedMax: 0,
                randomRotationDirection: false,
                randomStartRotation: false,
                fadeIn: true,
                fadeInDurationFac: 0.1,
                fadeInEase: 'linear',
                alphaStartMin: 0.7,
                alphaStartMax: 0.9,
                alphaEndMin: 0.7,
                alphaEndMax: 0.8,
                alphaEase: 'linear',
                tintStart: 0xffffff,
                tintEnd: 0xffffff,
                tintEase: 'linear',
                scaleIn: false,
                scaleInDurationFac: 0.2,
                scaleInEase: 'linear',
                uniformScale: true,
                scaleXStartMin: 1,
                scaleXStartMax: 1,
                scaleXEndMin: 1,
                scaleXEndMax: 1,
                scaleXEase: 'linear',
                scaleYStartMin: 1,
                scaleYStartMax: 1,
                scaleYEndMin: 1,
                scaleYEndMax: 1,
                scaleYEase: 'linear',
                scaleStartMin: 1,
                scaleStartMax: 1,
                scaleEndMin: 1,
                scaleEndMax: 1,
                scaleEase: 'linear',
                childs: [],
                spawn: {
                    onComplete: [],
                    onBounce: [],
                    onHalfway: [],
                    onStart: []
                }
            },
            childs: []
        },
        emitterSpawn: {
            type: 0,
            id: 0,
            scale: 1,
            adoptRotation: true,
            containerId: ''
        }
    };
    return Sanitizer;
}());
exports.Sanitizer = Sanitizer;

},{}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(componentId, texture, anchorX, anchorY) {
        var _this = _super.call(this, PIXI.Texture.fromFrame(texture)) || this;
        _this.componentId = componentId;
        _this.anchor.set(anchorX || 0.5, anchorY || 0.5);
        _this.__sequenceEndTime = null;
        return _this;
    }
    Sprite.prototype.recycle = function () {
        this.tint = 0xffffff;
        this.alpha = 1;
        this.transform.rotation = 0;
        this.transform.scale.set(1);
        if (this.parent)
            this.parent.removeChild(this);
        this.__fx.__recycleSprite(this.componentId, this);
    };
    Sprite.prototype.dispose = function () {
        this.__fx = null;
        this.recycle();
        this.destroy(false);
    };
    return Sprite;
}(PIXI.Sprite));
exports.Sprite = Sprite;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEmitterCore = (function () {
    function BaseEmitterCore(type) {
        this.type = type;
        this._dx = 0;
        this._dy = 0;
        this._rotation = 0;
    }
    BaseEmitterCore.prototype.init = function (emitter) {
        this.emitter = emitter;
        this._settings = emitter.settings.core.params;
        this.x = this.__x = emitter.x;
        this.y = this.__y = emitter.y;
        this.rotation = emitter.rotation;
    };
    BaseEmitterCore.prototype.emit = function (particle) {
    };
    BaseEmitterCore.prototype.prepare = function (spawnCount) {
        this._posInterpolationStep = 1 / spawnCount;
        this._t = this._posInterpolationStep * 0.5;
    };
    BaseEmitterCore.prototype.step = function () {
        this.__x = this.x;
        this.__y = this.y;
    };
    BaseEmitterCore.prototype.recycle = function () {
        this.emitter = null;
        this._settings = null;
    };
    BaseEmitterCore.prototype.dispose = function () {
        this.recycle();
        this.emitter = null;
        this._settings = null;
    };
    Object.defineProperty(BaseEmitterCore.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = value;
            this._dx = Math.cos(value);
            this._dy = Math.sin(value);
        },
        enumerable: true,
        configurable: true
    });
    BaseEmitterCore.__TYPE_BOX = 'box';
    BaseEmitterCore.__TYPE_CIRCLE = 'circle';
    BaseEmitterCore.__TYPE_RING = 'ring';
    return BaseEmitterCore;
}());
exports.BaseEmitterCore = BaseEmitterCore;

},{}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEmitterCore_1 = require("./BaseEmitterCore");
var Rnd_1 = require("../util/Rnd");
var BoxEmitterCore = (function (_super) {
    __extends(BoxEmitterCore, _super);
    function BoxEmitterCore() {
        return _super.call(this, BaseEmitterCore_1.BaseEmitterCore.__TYPE_BOX) || this;
    }
    BoxEmitterCore.prototype.emit = function (particle) {
        var settings = this._settings;
        var emitter = this.emitter;
        var w2 = settings.width * 0.5 * this.__scaleMod;
        var h2 = settings.height * 0.5 * this.__scaleMod;
        var angle = emitter.rotation;
        var x = Rnd_1.Rnd.float(-w2, w2);
        var y = Rnd_1.Rnd.float(-h2, h2);
        if (angle != 0) {
            particle.component.transform.position.x = (this.__x + this._t * (this.x - this.__x)) + x * Math.cos(angle) - y * Math.sin(angle);
            particle.component.transform.position.y = (this.__y + this._t * (this.y - this.__y)) + x * Math.sin(angle) + y * Math.cos(angle);
        }
        else {
            particle.component.transform.position.x = this.__x + this._t * (this.x - this.__x) + x;
            particle.component.transform.position.y = this.__y + this._t * (this.y - this.__y) + y;
        }
        if (settings.radial) {
            angle += Math.atan2(y, x);
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
        }
        particle.component.transform.rotation = angle;
        this._t += this._posInterpolationStep;
    };
    return BoxEmitterCore;
}(BaseEmitterCore_1.BaseEmitterCore));
exports.BoxEmitterCore = BoxEmitterCore;

},{"../util/Rnd":18,"./BaseEmitterCore":9}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEmitterCore_1 = require("./BaseEmitterCore");
var Rnd_1 = require("../util/Rnd");
var CircleEmitterCore = (function (_super) {
    __extends(CircleEmitterCore, _super);
    function CircleEmitterCore() {
        return _super.call(this, BaseEmitterCore_1.BaseEmitterCore.__TYPE_CIRCLE) || this;
    }
    CircleEmitterCore.prototype.emit = function (particle) {
        var settings = this._settings;
        var emitter = this.emitter;
        var angle;
        if (!settings.angle) {
            angle = Rnd_1.Rnd.float(0, 6.28319) + emitter.rotation;
        }
        else {
            angle = Rnd_1.Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }
        if (settings.radius > 0) {
            var r = Rnd_1.Rnd.float(0, settings.radius) * this.__scaleMod;
            particle.component.transform.position.x = (this.__x + this._t * (this.x - this.__x)) + Math.cos(angle) * r;
            particle.component.transform.position.y = (this.__y + this._t * (this.y - this.__y)) + Math.sin(angle) * r;
        }
        else {
            particle.component.x = this.__x + this._t * (this.x - this.__x);
            particle.component.y = this.__y + this._t * (this.y - this.__y);
        }
        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.transform.rotation = angle;
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.transform.rotation = emitter.rotation;
        }
        this._t += this._posInterpolationStep;
    };
    return CircleEmitterCore;
}(BaseEmitterCore_1.BaseEmitterCore));
exports.CircleEmitterCore = CircleEmitterCore;

},{"../util/Rnd":18,"./BaseEmitterCore":9}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEmitterCore_1 = require("./BaseEmitterCore");
var Rnd_1 = require("../util/Rnd");
var RingEmitterCore = (function (_super) {
    __extends(RingEmitterCore, _super);
    function RingEmitterCore() {
        return _super.call(this, BaseEmitterCore_1.BaseEmitterCore.__TYPE_RING) || this;
    }
    RingEmitterCore.prototype.prepare = function (spawnCount) {
        _super.prototype.prepare.call(this, spawnCount);
        var angle = this._settings.angle;
        if (2 * Math.PI - angle < 0.1) {
            this._uniformStep = angle / (spawnCount);
            this._angle = angle;
        }
        else {
            this._uniformStep = angle / (spawnCount - 1);
            this._angle = -angle * 0.5;
        }
    };
    RingEmitterCore.prototype.emit = function (particle) {
        var settings = this._settings;
        var emitter = this.emitter;
        var angle;
        if (settings.uniform) {
            angle = this._angle + emitter.rotation;
            this._angle += this._uniformStep;
        }
        else {
            angle = Rnd_1.Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }
        var r = settings.radius * this.__scaleMod;
        particle.component.transform.position.x = (this.__x + this._t * (this.x - this.__x)) + Math.cos(angle) * r;
        particle.component.transform.position.y = (this.__y + this._t * (this.y - this.__y)) + Math.sin(angle) * r;
        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.transform.rotation = angle;
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.transform.rotation = emitter.rotation;
        }
        this._t += this._posInterpolationStep;
    };
    return RingEmitterCore;
}(BaseEmitterCore_1.BaseEmitterCore));
exports.RingEmitterCore = RingEmitterCore;

},{"../util/Rnd":18,"./BaseEmitterCore":9}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FX_1 = require("./FX");
exports.FX = FX_1.FX;
var BaseEffect_1 = require("./BaseEffect");
exports.BaseEffect = BaseEffect_1.BaseEffect;
var EffectSequence_1 = require("./EffectSequence");
exports.EffectSequence = EffectSequence_1.EffectSequence;
var MovieClip_1 = require("./MovieClip");
exports.MovieClip = MovieClip_1.MovieClip;
var Particle_1 = require("./Particle");
exports.Particle = Particle_1.Particle;
var ParticleEmitter_1 = require("./ParticleEmitter");
exports.ParticleEmitter = ParticleEmitter_1.ParticleEmitter;
var Sprite_1 = require("./Sprite");
exports.Sprite = Sprite_1.Sprite;
var BaseEmitterCore_1 = require("./core/BaseEmitterCore");
exports.BaseEmitterCore = BaseEmitterCore_1.BaseEmitterCore;
var BoxEmitterCore_1 = require("./core/BoxEmitterCore");
exports.BoxEmitterCore = BoxEmitterCore_1.BoxEmitterCore;
var CircleEmitterCore_1 = require("./core/CircleEmitterCore");
exports.CircleEmitterCore = CircleEmitterCore_1.CircleEmitterCore;
var RingEmitterCore_1 = require("./core/RingEmitterCore");
exports.RingEmitterCore = RingEmitterCore_1.RingEmitterCore;
var Color_1 = require("./util/Color");
exports.Color = Color_1.Color;
var Easing_1 = require("./util/Easing");
exports.Easing = Easing_1.Easing;
var LinkedList_1 = require("./util/LinkedList");
exports.LinkedList = LinkedList_1.LinkedList;
var Rnd_1 = require("./util/Rnd");
exports.Rnd = Rnd_1.Rnd;
var FXSignal_1 = require("./util/FXSignal");
exports.FXSignal = FXSignal_1.FXSignal;

},{"./BaseEffect":1,"./EffectSequence":2,"./FX":3,"./MovieClip":4,"./Particle":5,"./ParticleEmitter":6,"./Sprite":8,"./core/BaseEmitterCore":9,"./core/BoxEmitterCore":10,"./core/CircleEmitterCore":11,"./core/RingEmitterCore":12,"./util/Color":14,"./util/Easing":15,"./util/FXSignal":16,"./util/LinkedList":17,"./util/Rnd":18}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color() {
    }
    Color.prototype.setRgb = function (startRgb, targetRgb) {
        this.startRgb = this.rgb = startRgb;
        this.r = this.sR = (startRgb >> 16) & 0xff;
        this.g = this.sG = (startRgb >> 8) & 0xff;
        this.b = this.sB = startRgb & 0xff;
        this.targetRgb = targetRgb;
        this.dR = ((targetRgb >> 16) & 0xff) - this.r;
        this.dG = ((targetRgb >> 8) & 0xff) - this.g;
        this.dB = (targetRgb & 0xff) - this.b;
    };
    Color.prototype.tween = function (ease, time, duration) {
        if (ease) {
            this.r = ease(time, this.sR, this.dR, duration);
            this.g = ease(time, this.sG, this.dG, duration);
            this.b = ease(time, this.sB, this.dB, duration);
        }
        else {
            time /= duration;
            this.r = this.dR * time + this.sR;
            this.g = this.dG * time + this.sG;
            this.b = this.dB * time + this.sB;
        }
        this.rgb = (this.r << 16) | (this.g << 8) | this.b;
        return this.rgb;
    };
    return Color;
}());
exports.Color = Color;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Easing = (function () {
    function Easing() {
    }
    Easing.linear = function (t, b, c, d) {
        return c * t / d + b;
    };
    Easing.easeInQuad = function (t, b, c, d) {
        return c * (t /= d) * t + b;
    };
    Easing.easeOutQuad = function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };
    Easing.easeInOutQuad = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        else {
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    };
    Easing.easeInCubic = function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    };
    Easing.easeOutCubic = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    };
    Easing.easeInOutCubic = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    };
    Easing.easeInQuart = function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    };
    Easing.easeOutQuart = function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    Easing.easeInOutQuart = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        else {
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    };
    Easing.easeInQuint = function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    };
    Easing.easeOutQuint = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    };
    Easing.easeInOutQuint = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    };
    Easing.easeInSine = function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };
    Easing.easeOutSine = function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };
    Easing.easeInOutSine = function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };
    Easing.easeInExpo = function (t, b, c, d) {
        if (t === 0) {
            return b;
        }
        else {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        }
    };
    Easing.easeOutExpo = function (t, b, c, d) {
        if (t === d) {
            return b + c;
        }
        else {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
    };
    Easing.easeInOutExpo = function (t, b, c, d) {
        if (t === 0) {
            b;
        }
        if (t === d) {
            b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        else {
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    };
    Easing.easeInCirc = function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    };
    Easing.easeOutCirc = function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    };
    Easing.easeInOutCirc = function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        else {
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    };
    Easing.easeInElastic = function (t, b, c, d) {
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            b;
        }
        else if ((t /= d) === 1) {
            b + c;
        }
        if (!p) {
            p = d * .3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    };
    Easing.easeOutElastic = function (t, b, c, d) {
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            b;
        }
        else if ((t /= d) === 1) {
            b + c;
        }
        if (!p) {
            p = d * .3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    };
    Easing.easeInOutElastic = function (t, b, c, d) {
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            b;
        }
        else if ((t /= d / 2) === 2) {
            b + c;
        }
        if (!p) {
            p = d * (.3 * 1.5);
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        else {
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    };
    Easing.easeInBack = function (t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };
    Easing.easeOutBack = function (t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };
    Easing.easeInOutBack = function (t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        else {
            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
        }
    };
    Easing.easeInBounce = function (t, b, c, d) {
        var v;
        v = Easing.easeOutBounce(d - t, 0, c, d);
        return c - v + b;
    };
    Easing.easeOutBounce = function (t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        }
        else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        }
        else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
        }
    };
    Easing.easeInOutBounce = function (t, b, c, d) {
        var v;
        if (t < d / 2) {
            v = Easing.easeInBounce(t * 2, 0, c, d);
            return v * .5 + b;
        }
        else {
            v = Easing.easeOutBounce(t * 2 - d, 0, c, d);
            return v * .5 + c * .5 + b;
        }
    };
    return Easing;
}());
exports.Easing = Easing;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = require("./LinkedList");
var FXSignal = (function () {
    function FXSignal() {
        this.__hasCallback = false;
        this._list = new LinkedList_1.LinkedList();
    }
    FXSignal.prototype.add = function (callback, scope, callRate) {
        this._list.add(new LinkedList_1.Node(new FXSignalListener(callback, scope, false, callRate)));
        this.__hasCallback = true;
    };
    FXSignal.prototype.addOnce = function (callback, scope) {
        this._list.add(new LinkedList_1.Node(new FXSignalListener(callback, scope, true)));
        this.__hasCallback = true;
    };
    FXSignal.prototype.dispatch = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var list = this._list;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            var call = true;
            var data = node.data;
            if (data.callRate) {
                if (data.calls % data.callRate != 0) {
                    call = false;
                }
            }
            if (call) {
                data.callback.apply(data.scope, params);
                if (data.once) {
                    list.remove(node);
                }
            }
            node = next;
        }
        this.__hasCallback = list.__length > 0;
    };
    FXSignal.prototype.remove = function (callback) {
        var list = this._list;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            if (node.data.callback === callback) {
                list.remove(node);
                return;
            }
            node = next;
        }
        this.__hasCallback = list.__length > 0;
    };
    FXSignal.prototype.removeAll = function () {
        this._list.clear();
        this.__hasCallback = false;
    };
    return FXSignal;
}());
exports.FXSignal = FXSignal;
var FXSignalListener = (function () {
    function FXSignalListener(callback, scope, once, callRate) {
        this.callback = callback;
        this.scope = scope;
        this.once = once;
        this.callRate = callRate;
        this.calls = 0;
    }
    return FXSignalListener;
}());
exports.FXSignalListener = FXSignalListener;

},{"./LinkedList":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList = (function () {
    function LinkedList() {
        this.__length = 0;
    }
    Object.defineProperty(LinkedList.prototype, "length", {
        get: function () {
            return this.__length;
        },
        enumerable: true,
        configurable: true
    });
    LinkedList.prototype.add = function (node) {
        if (this.first == null) {
            this.first = this.last = node;
        }
        else {
            node.prev = this.last;
            this.last.next = node;
            this.last = node;
        }
        node.list = this;
        this.__length++;
        return this;
    };
    LinkedList.prototype.remove = function (node) {
        if (node.list == null) {
            return;
        }
        if (this.first === this.last) {
            this.first = this.last = null;
        }
        else if (this.__length > 0) {
            if (node === this.last) {
                node.prev.next = null;
                this.last = node.prev;
            }
            else if (node === this.first) {
                node.next.prev = null;
                this.first = node.next;
            }
            else {
                node.next.prev = node.prev;
                node.prev.next = node.next;
            }
        }
        node.next = node.prev = node.list = null;
        this.__length--;
        return this;
    };
    LinkedList.prototype.clear = function () {
        if (!this.first)
            return;
        var node = this.first;
        while (node) {
            var next = node.next;
            node.next = node.prev = node.list = null;
            node = next;
        }
        this.first = this.last = null;
    };
    LinkedList.prototype.toArray = function () {
        var ret = [];
        if (!this.first)
            return ret;
        var node = this.first;
        while (node) {
            ret.push(node);
            node = node.next;
        }
        return ret;
    };
    return LinkedList;
}());
exports.LinkedList = LinkedList;
var Node = (function () {
    function Node(data) {
        this.data = data;
    }
    Node.prototype.update = function (dt) {
    };
    Node.prototype.dispose = function () {
    };
    return Node;
}());
exports.Node = Node;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rnd = (function () {
    function Rnd() {
    }
    Rnd.float = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    Rnd.bool = function (chance) {
        if (chance === void 0) { chance = 0.5; }
        return Math.random() < chance;
    };
    Rnd.sign = function (chance) {
        if (chance === void 0) { chance = 0.5; }
        return Math.random() < chance ? 1 : -1;
    };
    Rnd.bit = function (chance) {
        if (chance === void 0) { chance = 0.5; }
        return Math.random() < chance ? 1 : 0;
    };
    Rnd.integer = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };
    return Rnd;
}());
exports.Rnd = Rnd;

},{}]},{},[13])(13)
});
