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
var RevoltEffects_1 = require("./RevoltEffects");
var LinkedList_1 = require("./util/LinkedList");
var ParticleEmitter_1 = require("./ParticleEmitter");
var Rnd_1 = require("./util/Rnd");
var EffectSequence = /** @class */ (function (_super) {
    __extends(EffectSequence, _super);
    function EffectSequence(componentId) {
        var _this = _super.call(this, componentId) || this;
        _this._elements = new LinkedList_1.LinkedList();
        return _this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    EffectSequence.prototype.init = function (container, autoStart) {
        if (autoStart === void 0) { autoStart = true; }
        this.container = container;
        if (autoStart)
            this.start();
        return this;
    };
    EffectSequence.prototype.start = function () {
        if (this._active)
            return;
        this._startTime = Date.now() + (this.settings.delay ? this.settings.delay * 1000 : 0);
        this._index = 0;
        if (this._list.length == 0) {
            this._active = false;
            if (this.onExhaust)
                this.onExhaust(this);
            if (this.onComplete)
                this.onComplete(this);
            this.recycle();
        }
        this.exhausted = this.completed = false;
        this.setNextEffect();
        RevoltEffects_1.RevoltEffects.instance.__addActiveEffect(this);
        if (this.onStart)
            this.onStart(this);
        return this;
    };
    EffectSequence.prototype.update = function (dt) {
        var t = Date.now();
        if (t < this._startTime)
            return;
        this._time += dt;
        // console.log(t, this._effectStartTime, this._effectStartTime - t);
        if (!this.exhausted && t >= this._effectStartTime) {
            var RE = RevoltEffects_1.RevoltEffects.instance;
            var effect = void 0;
            var def = this._nextEffectSettings;
            var node_1;
            switch (def.componentType) {
                case RevoltEffects_1.ComponentType.Sprite:
                    effect = RE.getSprite(def.componentId);
                    this.container.addChildAt(effect, 0);
                    effect.blendMode = def.blendMode;
                    effect.tint = def.tint;
                    effect.scale.set(Rnd_1.Rnd.float(def.scaleMin, def.scaleMax));
                    effect.alpha = Rnd_1.Rnd.float(def.alphaMin, def.alphaMax);
                    node_1 = new LinkedList_1.Node({ component: effect, endTime: t + (def.duration) * 1000 });
                    break;
                case RevoltEffects_1.ComponentType.MovieClip:
                    effect = RE.getMovieClip(def.componentId);
                    if (def.componentParams) {
                        effect.animationSpeed = Rnd_1.Rnd.float(def.componentParams.animationSpeedMin || 1, def.componentParams.animationSpeedMax || 1);
                        effect.loop = def.componentParams.loop || false;
                    }
                    effect.gotoAndPlay(0);
                    this.container.addChildAt(effect, 0);
                    effect.blendMode = def.blendMode;
                    effect.tint = def.tint;
                    effect.scale.set(Rnd_1.Rnd.float(def.scaleMin, def.scaleMax));
                    effect.alpha = Rnd_1.Rnd.float(def.alphaMin, def.alphaMax);
                    node_1 = new LinkedList_1.Node({ component: effect, endTime: t + (def.duration) * 1000 });
                    break;
                case RevoltEffects_1.ComponentType.Emitter:
                    effect = RE.getParticleEmitter(def.componentId);
                    effect.init(this.container, true);
                    node_1 = new LinkedList_1.Node({ component: effect, endTime: effect.endTime });
                    break;
            }
            effect.x = this._x;
            effect.y = this._y;
            effect.rotation = this._rotation;
            this._elements.add(node_1);
            if (this._index == this._list.length) {
                this.exhausted = true;
                if (this.onExhaust)
                    this.onExhaust(this);
            }
            else {
                this.setNextEffect();
            }
        }
        var list = this._elements;
        var node = list.first;
        var next;
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
            if (this.onComplete)
                this.onComplete(this);
            this.recycle();
        }
    };
    EffectSequence.prototype.recycle = function () {
        var list = this._elements;
        var node = list.first;
        var next;
        while (node) {
            next = node.next;
            node.data.recycle();
            node = next;
        }
        list.clear();
        RevoltEffects_1.RevoltEffects.instance.__recycleEffect(this);
        console.log('recycle', this);
    };
    EffectSequence.prototype.dispose = function () {
        this._elements.clear();
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
    // *********************************************************************************************
    // * Internal																				   *
    // *********************************************************************************************
    EffectSequence.prototype.__applySettings = function (value) {
        this.settings = value;
        this._list = value.effects.slice();
        /* let effects = value.effects;
         let l = effects.length;
         let effect:BaseEffect;

         let RE = RevoltEffects.instance;

         for (let i = 0; i < l; i++) {
         let effectDef = effects[i];
         switch (effectDef.componentType) {
         case ComponentType.Sprite:
         effect = <BaseEffect>RE.__getSprite(effectDef.componentId);
         break;
         case ComponentType.MovieClip:
         eff
         break;
         case ComponentType.Emitter:
         break;

         }
         }*/
    };
    EffectSequence.prototype.setNextEffect = function () {
        if (this.exhausted)
            return;
        var def = this._nextEffectSettings = this._list[this._index++];
        this._effectStartTime = this._startTime + def.delay * 1000;
        console.log(def, this._effectStartTime);
    };
    return EffectSequence;
}(BaseEffect_1.BaseEffect));
exports.EffectSequence = EffectSequence;
