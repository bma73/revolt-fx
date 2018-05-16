import { RevoltEffects } from "./RevoltEffects";
import { Node } from "./util/LinkedList";
import { Color } from "./util/Color";
import { Easing } from "./util/Easing";
import { Rnd } from "./util/Rnd";
export class Particle extends Node {
    constructor() {
        super();
        this.dx = 0;
        this.dy = 0;
        this._color = new Color();
    }
    // *********************************************************************************************
    // * Public																					   *
    // *********************************************************************************************

    init(emitter, settings) {
        let component = this.component;
        this.emitter = emitter;
        this.settings = settings;
        this.duration = Rnd.float(settings.durationMin, settings.durationMax);
        this._dt = 1 / this.duration;
        this.time = 0;
        this.emitter.container.addChildAt(this.component, 0);
        if (settings.randomStartRotation)
            component.rotation = Rnd.float(0, 6.28319);
        component.blendMode = settings.blendMode || 0;
        this.startX = component.x;
        this.startY = component.y;
        this.useGravity = emitter.settings.gravity != null;
        if (this.useGravity) {
            this.gravity = emitter.settings.gravity;
            let speed = Rnd.float(settings.moveSpeedMin || 0, settings.moveSpeedMax || 0);
            this.moveSpeedX = speed * this.dx;
            this.moveSpeedY = speed * this.dy;
            this.floorY = emitter.settings.floorY || null;
            this.bounceFac = Rnd.float(settings.bounceFacMin || 0, settings.bounceFacMax || 0);
        }
        else {
            var d = this.distance = Rnd.integer(settings.distanceMin, settings.distanceMax);
            this.deltaX = (component.x + d * this.dx) - this.startX;
            this.deltaY = (component.y + d * this.dy) - this.startY;
            this.distanceEase = Easing[settings.distanceEase] || null;
        }
        this.useAlpha = settings.alphaStartMin != settings.alphaEndMin || settings.alphaStartMax != settings.alphaEndMax;
        if (this.useAlpha) {
            this.alphaStart = component.alpha = Rnd.float(settings.alphaStartMin, settings.alphaStartMax);
            this.alphaDelta = Rnd.float(settings.alphaEndMin, settings.alphaEndMax) - this.alphaStart;
            this.alphaEase = Easing[settings.alphaEase] || null;
        }
        this.useScale = settings.scaleStartMin != settings.scaleEndMin || settings.scaleStartMax != settings.scaleEndMax;
        if (this.useScale) {
            this.scaleStart = this.component.scale.x = this.component.scale.y = Rnd.float(settings.scaleStartMin, settings.scaleStartMax);
            this.scaleDelta = Rnd.float(settings.scaleEndMin, settings.scaleEndMax) - this.scaleStart;
            this.scaleEase = Easing[settings.scaleEase] || null;
        }
        this.useRotation = settings.rotationSpeedMin != settings.rotationSpeedMax;
        if (this.useRotation) {
            this.rotationSpeed = Rnd.float(settings.rotationSpeedMin, settings.rotationSpeedMax);
            if (settings.randomRotationDirection)
                this.rotationSpeed *= Rnd.sign();
        }
        this.useTint = settings.tintStart != this.tintEnd;
        if (this.useTint) {
            this.tintEase = Easing[settings.tintEase] || null;
            this._color.setRgb(settings.tintStart, settings.tintEnd);
        }
    }
    update(dt) {
        let t = this.time += dt;
        let duration = this.duration;
        if (t >= duration) {
            this.emitter.__removeParticle(this);
            return;
        }
        let component = this.component;
        let mod = t * this._dt;
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
    }
    recycle() {
        this.component.recycle();
        RevoltEffects.instance.__recycleParticle(this);
        this.dx = this.dy = 0;
        this.component.scale.set(1, 1);
        this.component = null;
        this.emitter = null;
        this.settings = null;
    }
    dispose() {
        this.recycle();
    }
}