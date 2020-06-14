"use strict";
/// <reference types="pixi.js" />
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
var ParticleEmitter = /** @class */ (function (_super) {
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
    // *********************************************************************************************
    // * Public																                                        					   *
    // *********************************************************************************************
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
    // *********************************************************************************************
    // * Private																				                                           *
    // *********************************************************************************************
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
    // *********************************************************************************************
    // * Internal																				                                           *
    // *********************************************************************************************
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
//# sourceMappingURL=ParticleEmitter.js.map