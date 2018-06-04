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
var RevoltEffects_1 = require("./RevoltEffects");
var LinkedList_1 = require("./util/LinkedList");
var Rnd_1 = require("./util/Rnd");
var BaseEffect_1 = require("./BaseEffect");
var ParticleEmitter = /** @class */ (function (_super) {
    __extends(ParticleEmitter, _super);
    function ParticleEmitter(componentId) {
        var _this = _super.call(this, componentId) || this;
        _this._particles = new LinkedList_1.LinkedList();
        _this._particleCount = 0;
        return _this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    ParticleEmitter.prototype.init = function (container, autoStart) {
        if (autoStart === void 0) { autoStart = true; }
        this.container = container;
        if (autoStart)
            this.start();
        return this;
    };
    ParticleEmitter.prototype.start = function () {
        if (this._active)
            return;
        var t = Date.now();
        var s = this.settings;
        this._time = Number.MAX_VALUE;
        if (s.duration > 0) {
            this.endTime = t + s.duration * 1000;
        }
        else {
            this.endTime = s.duration;
        }
        this._maxParticles = s.maxParticles;
        this._active = true;
        this.exhausted = this.completed = false;
        RevoltEffects_1.RevoltEffects.instance.__addActiveEffect(this);
        if (this.onStart)
            this.onStart(this);
        return this;
    };
    ParticleEmitter.prototype.stop = function (waitForParticles) {
        if (waitForParticles === void 0) { waitForParticles = true; }
        if (waitForParticles) {
            this.exhausted = true;
        }
        else {
            this.recycle();
        }
    };
    ParticleEmitter.prototype.update = function (dt) {
        // if (this.componentId == 'blast') console.log('update', this);
        if (!this._active)
            return;
        var t = Date.now();
        if (!this.exhausted) {
            if (this.endTime == 0) {
                this.spawn();
                this.exhausted = true;
            }
            else if (this.endTime == -1 || t < this.endTime) {
                this._time += dt;
                if (this._time >= this.settings.spawnFrequency) {
                    this._time = 0;
                    this.spawn();
                }
            }
            else {
                this.exhausted = true;
                if (this.onExhaust)
                    this.onExhaust(this);
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
        var s = this.settings;
        var n = s.spawnCount;
        this._core.prepare();
        var RE = RevoltEffects_1.RevoltEffects.instance;
        while (--n > -1) {
            if (this._particleCount == this._maxParticles)
                return;
            var ps = s.particleSettings, p = RE.__getParticle(), component = void 0;
            switch (s.particleSettings.componentType) {
                case RevoltEffects_1.ComponentType.Sprite:
                    p.componentId = s.particleSettings.componentId;
                    component = RE.getSprite(p.componentId);
                    break;
                case RevoltEffects_1.ComponentType.MovieClip:
                    p.componentId = s.particleSettings.componentId;
                    component = RE.getMovieClip(p.componentId);
                    if (ps.componentParams) {
                        component.loop = ps.componentParams.loop == null || !ps.componentParams.loop ? false : true;
                        component.animationSpeed = Rnd_1.Rnd.float(ps.componentParams.animationSpeedMin || 1, ps.componentParams.animationSpeedMax || 1);
                    }
                    component.gotoAndPlay(0);
                    break;
            }
            p.component = component;
            this._core.emit(p);
            p.init(this, ps);
            this._particles.add(p);
            this._particleCount++;
            RE.particleCount++;
        }
        this._core.step();
        return this;
    };
    ParticleEmitter.prototype.recycle = function () {
        var list = this._particles;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            node.recycle();
            node = next;
        }
        list.clear();
        this.settings = null;
        this._active = false;
        this.completed = true;
        this._core.dispose();
        this._core = null;
        RevoltEffects_1.RevoltEffects.instance.__recycleEffect(this);
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
        this.componentId = null;
        this.settings = null;
        this._active = false;
        this.completed = true;
        this._core.dispose();
        this._core = null;
        this.onComplete = this.onStart = this.onExhaust = null;
    };
    Object.defineProperty(ParticleEmitter.prototype, "maxParticles", {
        get: function () {
            return this._maxParticles;
        },
        set: function (value) {
            this._maxParticles = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "core", {
        get: function () {
            return this._core;
        },
        set: function (value) {
            this._core = value;
            this.core.x = this._x;
            this.core.y = this._x;
            this.core.rotation = this._rotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = this._core.y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = this._core.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleEmitter.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            this._rotation = this._core.rotation = value;
        },
        enumerable: true,
        configurable: true
    });
    // *********************************************************************************************
    // * Internal																				   *
    // *********************************************************************************************
    ParticleEmitter.prototype.__removeParticle = function (particle) {
        if (particle.settings.spawnOnCompleteEmitterId) {
            var emitter = RevoltEffects_1.RevoltEffects.instance.getParticleEmitter(particle.settings.spawnOnCompleteEmitterId);
            emitter.init(this.container);
            emitter.x = particle.component.x;
            emitter.y = particle.component.y;
            emitter.rotation = particle.component.rotation;
        }
        this._particles.remove(particle);
        this._particleCount--;
        RevoltEffects_1.RevoltEffects.instance.particleCount--;
        particle.recycle();
        if (this.exhausted && this._particleCount == 0) {
            this._active = false;
            this.completed = true;
            if (this.onComplete)
                this.onComplete(this);
            this.recycle();
        }
    };
    ParticleEmitter.prototype.__applySettings = function (value) {
        this.settings = value;
        this.core = new ((_a = value.core.clazz).bind.apply(_a, [void 0].concat([this, value.core.params])))();
        var _a;
    };
    return ParticleEmitter;
}(BaseEffect_1.BaseEffect));
exports.ParticleEmitter = ParticleEmitter;
