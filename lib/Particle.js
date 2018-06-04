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
