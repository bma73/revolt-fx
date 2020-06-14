"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Particle = void 0;
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "y", {
        get: function () {
            return this.component.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "on", {
        get: function () {
            return this.__on;
        },
        enumerable: false,
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
//# sourceMappingURL=Particle.js.map