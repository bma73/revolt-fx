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
var EffectSequence = /** @class */ (function (_super) {
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
    // *********************************************************************************************
    // * Public																			                                        		   *
    // *********************************************************************************************
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
    // *********************************************************************************************
    // * Private																		           *                              		   *
    // *********************************************************************************************
    EffectSequence.prototype.setNextEffect = function () {
        if (this.exhausted)
            return;
        var def = this._nextEffectSettings = this._list[this._index++];
        this._effectStartTime = this._startTime + def.delay * 1000;
    };
    // *********************************************************************************************
    // * Internal																		           *                              		   *
    // *********************************************************************************************
    EffectSequence.prototype.__applySettings = function (value) {
        this.settings = value;
        this.name = value.name;
        this._list = value.effects.slice();
        this.__recycled = false;
    };
    return EffectSequence;
}(BaseEffect_1.BaseEffect));
exports.EffectSequence = EffectSequence;
//# sourceMappingURL=EffectSequence.js.map