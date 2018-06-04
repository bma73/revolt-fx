/*!
 * tslib - v0.1.0
 * Compiled Thu, 17 May 2018 14:36:47 UTC
 *
 * tslib is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
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
var BaseEffect = /** @class */ (function (_super) {
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
        return _this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
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
    // *********************************************************************************************
    // * internal																				   *
    // *********************************************************************************************
    BaseEffect.prototype.__applySettings = function (value) {
    };
    return BaseEffect;
}(LinkedList_1.Node));
exports.BaseEffect = BaseEffect;

},{"./util/LinkedList":14}],2:[function(require,module,exports){
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

},{"./BaseEffect":1,"./ParticleEmitter":5,"./RevoltEffects":6,"./util/LinkedList":14,"./util/Rnd":15}],3:[function(require,module,exports){
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
var MovieClip = /** @class */ (function (_super) {
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
        // this.play();
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    MovieClip.prototype.recycle = function () {
        // console.log('recycle MovieClip');
        if (this.parent)
            this.parent.removeChild(this);
        this.gotoAndStop(0);
        RevoltEffects_1.RevoltEffects.instance.__recycleObject(this.componentId, this);
    };
    MovieClip.prototype.dispose = function () {
        this.recycle();
        this.destroy();
    };
    return MovieClip;
}(PIXI.extras.AnimatedSprite));
exports.MovieClip = MovieClip;

},{"./RevoltEffects":6}],4:[function(require,module,exports){
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
var Color_1 = require("./util/Color");
var Easing_1 = require("./util/Easing");
var Rnd_1 = require("./util/Rnd");
var Particle = /** @class */ (function (_super) {
    __extends(Particle, _super);
    function Particle() {
        var _this = _super.call(this) || this;
        _this.dx = 0;
        _this.dy = 0;
        _this._color = new Color_1.Color();
        return _this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    // public init(component: any,
    //             duration: number,
    //             alphaStart: number = 1,
    //             alphaEnd: number = 1,
    //             scaleStart: number = 1,
    //             scaleEnd: number = 1,
    //             rotationStart: number = 0,
    //             rotationEnd: number = 0,
    //             tintStart: number = 0xffffff,
    //             tintEnd: number = 0xffffff,
    //             dx: number = 0,
    //             dy: number = 0,
    //             spawnOnComplete: ParticleEmitter = null) {
    Particle.prototype.init = function (emitter, settings) {
        var component = this.component;
        this.emitter = emitter;
        this.settings = settings;
        this.duration = Rnd_1.Rnd.float(settings.durationMin, settings.durationMax);
        this._dt = 1 / this.duration;
        this.time = 0;
        this.emitter.container.addChildAt(this.component, 0);
        if (settings.randomStartRotation)
            component.rotation = Rnd_1.Rnd.float(0, 6.28319);
        component.blendMode = settings.blendMode || 0;
        this.startX = component.x;
        this.startY = component.y;
        this.useGravity = emitter.settings.gravity != null;
        if (this.useGravity) {
            this.gravity = emitter.settings.gravity;
            var speed = Rnd_1.Rnd.float(settings.moveSpeedMin || 0, settings.moveSpeedMax || 0);
            this.moveSpeedX = speed * this.dx;
            this.moveSpeedY = speed * this.dy;
            this.floorY = emitter.settings.floorY || null;
            this.bounceFac = Rnd_1.Rnd.float(settings.bounceFacMin || 0, settings.bounceFacMax || 0);
        }
        else {
            var d = this.distance = Rnd_1.Rnd.integer(settings.distanceMin, settings.distanceMax);
            this.deltaX = (component.x + d * this.dx) - this.startX;
            this.deltaY = (component.y + d * this.dy) - this.startY;
            this.distanceEase = Easing_1.Easing[settings.distanceEase] || null;
        }
        this.useAlpha = settings.alphaStartMin != settings.alphaEndMin || settings.alphaStartMax != settings.alphaEndMax;
        if (this.useAlpha) {
            this.alphaStart = component.alpha = Rnd_1.Rnd.float(settings.alphaStartMin, settings.alphaStartMax);
            this.alphaDelta = Rnd_1.Rnd.float(settings.alphaEndMin, settings.alphaEndMax) - this.alphaStart;
            this.alphaEase = Easing_1.Easing[settings.alphaEase] || null;
        }
        this.useScale = settings.scaleStartMin != settings.scaleEndMin || settings.scaleStartMax != settings.scaleEndMax;
        if (this.useScale) {
            this.scaleStart = this.component.scale.x = this.component.scale.y = Rnd_1.Rnd.float(settings.scaleStartMin, settings.scaleStartMax);
            this.scaleDelta = Rnd_1.Rnd.float(settings.scaleEndMin, settings.scaleEndMax) - this.scaleStart;
            this.scaleEase = Easing_1.Easing[settings.scaleEase] || null;
        }
        this.useRotation = settings.rotationSpeedMin != settings.rotationSpeedMax;
        if (this.useRotation) {
            this.rotationSpeed = Rnd_1.Rnd.float(settings.rotationSpeedMin, settings.rotationSpeedMax);
            if (settings.randomRotationDirection)
                this.rotationSpeed *= Rnd_1.Rnd.sign();
        }
        this.useTint = settings.tintStart != this.tintEnd;
        if (this.useTint) {
            this.tintEase = Easing_1.Easing[settings.tintEase] || null;
            this._color.setRgb(settings.tintStart, settings.tintEnd);
        }
    };
    Particle.prototype.update = function (dt) {
        var t = this.time += dt;
        var duration = this.duration;
        if (t >= duration) {
            this.emitter.__removeParticle(this);
            return;
        }
        var component = this.component;
        var mod = t * this._dt;
        //Distance
        if (this.useGravity) {
            component.x += this.moveSpeedX;
            component.y += this.moveSpeedY += this.gravity;
            if (this.floorY != null) {
                if (component.y > this.floorY) {
                    component.y = this.floorY;
                    this.moveSpeedY *= -this.bounceFac;
                }
            }
        }
        else {
            if (this.distanceEase) {
                component.x = this.distanceEase(t, this.startX, this.deltaX, duration);
                component.y = this.distanceEase(t, this.startY, this.deltaY, duration);
            }
            else {
                component.x = this.deltaX * mod + this.startX;
                component.y = this.deltaY * mod + this.startY;
            }
        }
        //Alpha
        if (this.useAlpha) {
            if (this.alphaEase) {
                component.alpha = this.alphaEase(t, this.alphaStart, this.alphaDelta, duration);
            }
            else {
                component.alpha = (this.alphaDelta) * mod + this.alphaStart;
            }
        }
        //Rotation
        if (this.useRotation) {
            component.rotation += this.rotationSpeed;
        }
        //Scale
        if (this.useScale) {
            if (this.scaleEase) {
                component.scale.x = component.scale.y = this.scaleEase(t, this.scaleStart, this.scaleDelta, duration);
            }
            else {
                component.scale.x = component.scale.y = this.scaleDelta * mod + this.scaleStart;
            }
        }
        //Tint
        if (this.useTint) {
            component.tint = this._color.tween(this.tintEase, t, duration);
        }
    };
    Particle.prototype.recycle = function () {
        // console.log('recycle Particle');
        this.component.recycle();
        RevoltEffects_1.RevoltEffects.instance.__recycleParticle(this);
        this.dx = this.dy = 0;
        this.component.scale.set(1, 1);
        this.component = null;
        this.emitter = null;
        this.settings = null;
    };
    Particle.prototype.dispose = function () {
        this.recycle();
    };
    return Particle;
}(LinkedList_1.Node));
exports.Particle = Particle;

},{"./RevoltEffects":6,"./util/Color":12,"./util/Easing":13,"./util/LinkedList":14,"./util/Rnd":15}],5:[function(require,module,exports){
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

},{"./BaseEffect":1,"./RevoltEffects":6,"./util/LinkedList":14,"./util/Rnd":15}],6:[function(require,module,exports){
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

},{"./EffectSequence":2,"./MovieClip":3,"./Particle":4,"./ParticleEmitter":5,"./Sprite":7,"./util/LinkedList":14}],7:[function(require,module,exports){
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var RevoltEffects_1 = require("./RevoltEffects");
var PIXI = __importStar(require("pixi.js"));
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(componentId, texture, anchorX, anchorY) {
        var _this = _super.call(this, PIXI.Texture.fromFrame(texture)) || this;
        _this.componentId = componentId;
        _this.anchor.set(anchorX || 0.5, anchorY || 0.5);
        _this.__sequenceEndTime = null;
        return _this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    Sprite.prototype.recycle = function () {
        // console.log('recycle Sprite');
        if (this.parent)
            this.parent.removeChild(this);
        RevoltEffects_1.RevoltEffects.instance.__recycleObject(this.componentId, this);
        // this.x = this.y = 0;
        // console.log(this, 'recycle');
    };
    Sprite.prototype.dispose = function () {
        this.recycle();
        this.destroy(false);
    };
    return Sprite;
}(PIXI.Sprite));
exports.Sprite = Sprite;

},{"./RevoltEffects":6,"pixi.js":undefined}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEmitterCore = /** @class */ (function () {
    function BaseEmitterCore(emitter) {
        this.emitter = emitter;
        this._dx = 0;
        this._dy = 0;
        this._rotation = 0;
        this._settings = emitter.settings.core.params;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    BaseEmitterCore.prototype.emit = function (particle) {
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
    BaseEmitterCore.prototype.prepare = function () {
    };
    BaseEmitterCore.prototype.step = function () {
    };
    BaseEmitterCore.prototype.dispose = function () {
        this.emitter = null;
    };
    return BaseEmitterCore;
}());
exports.BaseEmitterCore = BaseEmitterCore;

},{}],9:[function(require,module,exports){
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
var BoxEmitterCore = /** @class */ (function (_super) {
    __extends(BoxEmitterCore, _super);
    function BoxEmitterCore(emitter) {
        return _super.call(this, emitter) || this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    BoxEmitterCore.prototype.emit = function (particle) {
        var settings = this._settings;
        var emitter = this.emitter;
        var w2 = settings.width * 0.5;
        var h2 = settings.height * 0.5;
        var angle = emitter.rotation;
        var x = Rnd_1.Rnd.float(-w2, w2);
        var y = Rnd_1.Rnd.float(-h2, h2);
        if (angle != 0) {
            particle.component.x = this.x + x * Math.cos(angle) - y * Math.sin(angle);
            particle.component.y = this.y + x * Math.sin(angle) + y * Math.cos(angle);
        }
        else {
            particle.component.x = this.x + x;
            particle.component.y = this.y + y;
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
        particle.component.rotation = angle;
    };
    return BoxEmitterCore;
}(BaseEmitterCore_1.BaseEmitterCore));
exports.BoxEmitterCore = BoxEmitterCore;

},{"../util/Rnd":15,"./BaseEmitterCore":8}],10:[function(require,module,exports){
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
var CircleEmitterCore = /** @class */ (function (_super) {
    __extends(CircleEmitterCore, _super);
    function CircleEmitterCore(emitter) {
        return _super.call(this, emitter) || this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
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
            var r = Rnd_1.Rnd.float(0, settings.radius);
            particle.component.x = this.x + Math.cos(angle) * r;
            particle.component.y = this.y + Math.sin(angle) * r;
        }
        else {
            particle.component.x = this.x;
            particle.component.y = this.y;
        }
        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.rotation = angle;
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.rotation = emitter.rotation;
        }
    };
    return CircleEmitterCore;
}(BaseEmitterCore_1.BaseEmitterCore));
exports.CircleEmitterCore = CircleEmitterCore;

},{"../util/Rnd":15,"./BaseEmitterCore":8}],11:[function(require,module,exports){
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
var RingEmitterCore = /** @class */ (function (_super) {
    __extends(RingEmitterCore, _super);
    function RingEmitterCore(emitter) {
        return _super.call(this, emitter) || this;
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
    RingEmitterCore.prototype.emit = function (particle) {
        var settings = this._settings;
        var emitter = this.emitter;
        var angle;
        if (!settings.angle) {
            if (settings.uniform) {
                angle = this._angle + emitter.rotation;
                this._angle += this._uniformStep;
            }
            else {
                angle = Rnd_1.Rnd.float(0, 6.28319) + emitter.rotation;
            }
        }
        else {
            angle = Rnd_1.Rnd.float(-settings.angle * 0.5, settings.angle * 0.5) + emitter.rotation;
        }
        var r = settings.radius;
        particle.component.x = this.x + Math.cos(angle) * r;
        particle.component.y = this.y + Math.sin(angle) * r;
        if (settings.radial) {
            particle.dx = Math.cos(angle);
            particle.dy = Math.sin(angle);
            particle.component.rotation = angle;
        }
        else {
            particle.dx = this._dx;
            particle.dy = this._dy;
            particle.component.rotation = emitter.rotation;
        }
    };
    RingEmitterCore.prototype.prepare = function () {
        this._uniformStep = 6.28319 / this.emitter.settings.spawnCount;
        this._angle = 0;
    };
    RingEmitterCore.prototype.step = function () {
    };
    return RingEmitterCore;
}(BaseEmitterCore_1.BaseEmitterCore));
exports.RingEmitterCore = RingEmitterCore;

},{"../util/Rnd":15,"./BaseEmitterCore":8}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = /** @class */ (function () {
    function Color() {
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************
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

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Easing = /** @class */ (function () {
    function Easing() {
    }
    Easing.linear = function (t, b, c, d) {
        return c * t / d + b;
    };
    Easing.easeInQuad = function (t, b, c, d) {
        return c * (t /= d) * t + b;
    };
    Easing.easeOutQuad = function (t, b, c, d) {
        console.log(arguments);
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

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        this._length = 0;
    }
    Object.defineProperty(LinkedList.prototype, "length", {
        // *********************************************************************************************
        // * Public																					   *
        // *********************************************************************************************
        get: function () {
            return this._length;
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
        this._length++;
        return this;
    };
    LinkedList.prototype.remove = function (node) {
        if (this.first === this.last) {
            this.first = this.last = null;
        }
        else if (this._length > 0) {
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
        this._length--;
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
    return LinkedList;
}());
exports.LinkedList = LinkedList;
var Node = /** @class */ (function () {
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

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rnd = /** @class */ (function () {
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

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseEffect_js_1 = require("./BaseEffect.js");
exports.BaseEffect = BaseEffect_js_1.BaseEffect;
var EffectSequence_js_1 = require("./EffectSequence.js");
exports.EffectSequence = EffectSequence_js_1.EffectSequence;
var MovieClip_js_1 = require("./MovieClip.js");
exports.MovieClip = MovieClip_js_1.MovieClip;
var Particle_js_1 = require("./Particle.js");
exports.Particle = Particle_js_1.Particle;
var ParticleEmitter_js_1 = require("./ParticleEmitter.js");
exports.ParticleEmitter = ParticleEmitter_js_1.ParticleEmitter;
var RevoltEffects_js_1 = require("./RevoltEffects.js");
exports.RevoltEffects = RevoltEffects_js_1.RevoltEffects;
var Sprite_js_1 = require("./Sprite.js");
exports.Sprite = Sprite_js_1.Sprite;
var BaseEmitterCore_js_1 = require("./core/BaseEmitterCore.js");
exports.BaseEmitterCore = BaseEmitterCore_js_1.BaseEmitterCore;
var BoxEmitterCore_js_1 = require("./core/BoxEmitterCore.js");
exports.BoxEmitterCore = BoxEmitterCore_js_1.BoxEmitterCore;
var CircleEmitterCore_js_1 = require("./core/CircleEmitterCore.js");
exports.CircleEmitterCore = CircleEmitterCore_js_1.CircleEmitterCore;
var RingEmitterCore_js_1 = require("./core/RingEmitterCore.js");
exports.RingEmitterCore = RingEmitterCore_js_1.RingEmitterCore;
var Color_js_1 = require("./util/Color.js");
exports.Color = Color_js_1.Color;
var Easing_js_1 = require("./util/Easing.js");
exports.Easing = Easing_js_1.Easing;
var LinkedList_js_1 = require("./util/LinkedList.js");
exports.LinkedList = LinkedList_js_1.LinkedList;
var Rnd_js_1 = require("./util/Rnd.js");
exports.Rnd = Rnd_js_1.Rnd;

},{"./BaseEffect.js":1,"./EffectSequence.js":2,"./MovieClip.js":3,"./Particle.js":4,"./ParticleEmitter.js":5,"./RevoltEffects.js":6,"./Sprite.js":7,"./core/BaseEmitterCore.js":8,"./core/BoxEmitterCore.js":9,"./core/CircleEmitterCore.js":10,"./core/RingEmitterCore.js":11,"./util/Color.js":12,"./util/Easing.js":13,"./util/LinkedList.js":14,"./util/Rnd.js":15}]},{},[16])(16)
});


//# sourceMappingURL=revolt-fx.js.map
